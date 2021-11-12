/**
 * メディアのダウンロードに関するクラス
 */

import axios, { CancelTokenSource } from 'axios'
import { MediaDownloadError } from '~/modules/customError'
import {
  getFileName as getImageFileName,
  getOriginal,
} from '~/modules/imageUrl'
import { MediaDownloadQueue } from '~/modules/mediaDownloadQueue'
import { getFileName as getVideoFileName } from '~/modules/videoUrl'
import { selectHighest } from '~/modules/videoVariant'
import { concurrency as concurrencySetting } from '~/preferences/mediaDownload'
import { isPhoto } from '~/preferences/mediaType'
import { Media, VideoInfo } from '~openapi/generated/src'

/**
 * MediaDownloaderクラスで扱われるダウンロード処理向けのメディア情報
 */
type MediaInformation = { url: string; name: string }

/**
 * MediaDownloaderクラスで扱われるメディア情報
 */
type Content = { name: string; blob: Blob }

/**
 * 進捗情報を記録するカウンター
 */
type ProcessCounter = { processed: number; total: number }

/**
 * メディアのダウンロードに関するクラス
 */
class MediaDownloader {
  /**
   * 同時に処理する数
   */
  private readonly _concurrency: number

  /**
   * ダウンロードをキャンセルするためのトークン
   */
  private _cancelTokenSource: CancelTokenSource

  /**
   * ダウンロード先となるメディアの一覧
   */
  private _medias: MediaInformation[] = []

  /**
   * ダウンロード後のメディア一覧
   */
  private _contents: Content[] = []

  /**
   * ダウンロード中に発生したエラーの一覧
   */
  private _errors: MediaDownloadError[] = []

  /**
   * コンストラクタ
   * @param medias ダウンロード先のメディア一覧
   * @param concurrency 同時に処理する数
   */
  constructor(medias?: Media[], concurrency?: number) {
    this._cancelTokenSource = axios.CancelToken.source()

    if (medias) {
      this.setMedias(medias)
    }

    this._concurrency = concurrency || concurrencySetting
  }

  /**
   * ダウンロード先のメディアを決定する
   * @param medias ダウンロード先のメディア一覧
   */
  setMedias(medias: Media[]) {
    this._medias = this._generateMediaInfomations(medias)
  }

  /**
   * メディア一覧から、ダウンロード処理向けにURL・ファイル名・実施状況が記されたメディア一覧を生成する
   * @param medias メディア一覧
   * @returns URL・ファイル名が記されたメディア一覧
   */
  private _generateMediaInfomations(medias: Media[]) {
    // メディアの種別が画像以外の場合、動画情報が含まれていない可能性があるため、検証を行う
    const filteredMedias = medias.filter((media) => {
      if (isPhoto(media.type)) {
        return true
      }

      if (media.video_info) {
        return true
      }

      this._errors.push(
        new MediaDownloadError({
          message: '動画情報が見つかりませんでした',
          data: media.expanded_url,
        }),
      )
      return false
    })

    // メディア情報（URL・ファイル名）を取得する
    const mediaInformations = filteredMedias.map((media) => {
      // メディアの種別（'画像'と'それ以外（動画・GIFアニメーションの想定）'）によってダウンロード先のURLが異なる
      return isPhoto(media.type)
        ? this._selectImage(media.media_url_https)
        : this._selectVideo(media.video_info!) // 前述の検証処理で存在の確認を行なっている前提
    })

    return mediaInformations
  }

  /**
   * 画像情報から、オリジナル画像のURLとファイル名を抽出する
   * @param url 画像URL
   * @returns 画像のURLとファイル名
   */
  private _selectImage(url: string) {
    const originalUrl = getOriginal(url) // もっとも画質が高いものを選択する
    const name = getImageFileName(url)

    return { url: originalUrl, name }
  }

  /**
   * 動画情報の中から、もっとも画質が高いもののURLとファイル名を抽出する
   * @param info 動画情報
   * @returns 動画のURLとファイル名
   */
  private _selectVideo(info: VideoInfo) {
    const video = selectHighest(info.variants) // もっとも画質が高いものを選択する
    const name = getVideoFileName(video.url)

    return { url: video.url, name }
  }

  /**
   * メディアをダウンロードする
   * @param counter 進捗状況を記録するカウンター
   * @throws {@link MediaDownloadError} ダウンロード可能なメディアが存在しない（対象が0件）の場合
   */
  async download(counter?: ProcessCounter) {
    if (this._medias.length === 0) {
      throw new MediaDownloadError('ダウンロード可能なメディアが存在しません')
    }

    // 進捗状況の初期化
    if (counter) {
      counter.total = this._medias.length
      counter.processed = 0
    }

    // 初期化処理
    this._errors = []
    const queue = new MediaDownloadQueue(this._cancelTokenSource.token)

    // 規定件数ずつ取得処理を行う
    for (let i = 0; i < this._medias.length; i = i + this._concurrency) {
      // メディアのダウンロード
      const slicedMedias = this._medias.slice(i, i + this._concurrency)
      const contents = await queue.download(slicedMedias)
      this._contents.push(...contents.resolves) // ダウンロードしたメディアを記録する
      this._errors.push(...contents.rejects) // エラー情報を記録する

      // 進捗状況の更新
      if (counter) {
        this._setProcessCounter(counter, this._concurrency)
      }
    }
  }

  /**
   * メディアのダウンロード処理を中止させる
   */
  abort() {
    this._cancelTokenSource.cancel()
  }

  /**
   * メディアのダウンロード処理を初期化する
   */
  reset() {
    this.abort()
    this._regenerateCancelTokenSource()
    this.setMedias([])
    this._contents = []
    this._errors = []
  }

  /**
   * ダウンロードをキャンセルするためのトークンを再生成する
   */
  private _regenerateCancelTokenSource() {
    this._cancelTokenSource = axios.CancelToken.source()
  }

  /**
   * 進捗状況のカウンターを更新する
   * @param counter 更新したいカウンター
   * @param count 追加で完了した数
   */
  private _setProcessCounter(counter: ProcessCounter, count: number) {
    // 最大値を超えてしまう場合は、最大値で設定する
    if (counter.processed + count > counter.total) {
      counter.processed = counter.total
      return
    }

    counter.processed = counter.processed + count
  }

  /**
   * ダウンロードしたメディア一覧を取得する
   */
  get contents() {
    return this._contents
  }

  /**
   * ダウンロード中に発生したエラーの一覧を取得する
   */
  get errors() {
    return this._errors
  }
}

export { MediaInformation, Content, ProcessCounter, MediaDownloader }
