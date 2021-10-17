/**
 * メディアのダウンロードに関するクラス
 */

import axios from 'axios'
import { MediaDownloadError } from '~/modules/customError'
import { addParameter } from '~/modules/query'
import { selectHighest } from '~/modules/videoVariant'
import {
  originalImageUrlParameter,
  processInterval,
} from '~/preferences/mediaDownload'
import { isPhoto } from '~/preferences/mediaType'
import { Media, VideoInfo } from '~openapi/generated/src'

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
   * 処理の実行間隔に関する設定値
   */
  private readonly _processInterval = processInterval

  /**
   * ダウンロードをキャンセルするためのトークン
   */
  private readonly _cancelTokenSource = axios.CancelToken.source()

  /**
   * ダウンロード先となるメディアの一覧
   */
  private readonly _medias: Media[]

  /**
   * ダウンロード後のメディア一覧
   */
  private _contents: Content[] = []

  /**
   * URIからファイル名を特定するための正規表現パターン
   */
  private readonly meidaUrlPattern = {
    image: /(?<name>[a-zA-Z0-9-_]+\.[jpg|jpeg|png]+)/i,
    video: /(?<name>[a-zA-Z0-9-_]+\.[mp4]+)/i,
  }

  /**
   * コンストラクタ
   * ダウンロード先のメディアを決定する
   * @param medias ダウンロード先のメディア一覧
   */
  constructor(medias: Media[]) {
    this._medias = medias
  }

  /**
   * メディアをダウンロードする
   * @param counter 進捗状況を記録するカウンター
   */
  async download(counter?: ProcessCounter) {
    // 進捗状況の初期化
    if (counter) {
      counter.total = this._medias.length
      counter.processed = 0
    }

    // 規定件数ずつ取得処理を行う
    for (
      let i = 0;
      i < this._medias.length;
      i = i + this._processInterval.count
    ) {
      // 2回目以降の取得処理の場合、負荷上昇を防止するためにスリープを挟む
      if (i > 0) {
        await this._sleep(this._processInterval.sleep)
      }

      // メディアのダウンロード
      const slicedMedias = this._medias.slice(
        i,
        i + this._processInterval.count,
      )
      const content = await this._getContents(slicedMedias)
      this._contents = this._contents.concat(content)

      // 進捗状況の更新
      if (counter) {
        this._setProcessCounter(counter, this._processInterval.count)
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
   * スリープ処理を実施する
   * @param time スリープを挟む時間（ミリ秒）
   * @returns スリープ後にresolveが返却されるPromise
   */
  private _sleep(time: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }

  /**
   * 指定のメディアをダウンロードする
   * @param medias メディア情報
   * @returns ダウンロードしたメディア一覧
   */
  private async _getContents(medias: Media[]) {
    // 処理速度を速めるために、並列実行を行なっている
    const promises = this._generatePromisesForDownload(medias)
    const contents = await Promise.all(promises)

    return contents
  }

  /**
   * メディアのコンテンツを並列処理でダウンロードするために、Promiseを生成する
   * @param medias メディア情報
   * @returns ダウンロード処理が格納されたPromiseの一覧
   */
  private _generatePromisesForDownload(medias: Media[]) {
    const promises = medias.map((media) => {
      // メディアの種別によってダウンロード先のURLが異なる
      const mediaInformation = isPhoto(media.type)
        ? this._selectImage(media.media_url_https)
        : this._selectVideo(media.video_info!) // 動画の場合、APIの返却値には動画情報が含まれる前提である

      const promise = axios
        .get(mediaInformation.url, {
          responseType: 'blob',
          cancelToken: this._cancelTokenSource.token,
        })
        .then((response) => {
          if (response.status !== 200) {
            throw new MediaDownloadError({
              message: 'データを取得できませんでした',
              data: mediaInformation,
            })
          }

          const blob = new Blob([response.data], {
            type: response.data.type,
          })

          return {
            name: mediaInformation.name,
            blob,
          }
        })
        .catch((reason) => {
          if (axios.isCancel(reason)) {
            throw new MediaDownloadError({
              message: 'キャンセルされました',
              data: mediaInformation,
            })
          }

          throw new MediaDownloadError({
            message: '通信処理に失敗しました',
            data: mediaInformation,
          })
        })

      return promise
    })

    return promises
  }

  /**
   * 動画情報の中から、最も画質が高いもののURLとファイル名を抽出する
   * @param info 動画情報
   * @returns 動画のURLとファイル名
   */
  private _selectVideo(info: VideoInfo) {
    // 最も画質が高いものを選択する
    const video = selectHighest(info.variants)

    // URL・ファイル名の抽出
    const regExpResult = this.meidaUrlPattern.video.exec(video.url)
    const name = regExpResult?.groups?.name

    if (name === undefined) {
      throw new MediaDownloadError({
        message: '動画のファイル名を算出できませんでした',
        data: video.url,
      })
    }

    return {
      url: video.url,
      name,
    }
  }

  /**
   * 画像情報から、オリジナル画像のURLとファイル名を抽出する
   * @param url 画像URL
   * @returns 画像のURLとファイル名
   */
  private _selectImage(url: string) {
    // 最も画質が高いものを選択する
    const originalUrl = addParameter(url, originalImageUrlParameter)

    // URL・ファイル名の抽出
    const regExpResult = this.meidaUrlPattern.image.exec(url)
    const name = regExpResult?.groups?.name

    if (name === undefined) {
      throw new MediaDownloadError({
        message: '画像のファイル名を算出できませんでした',
        data: url,
      })
    }

    return {
      url: originalUrl,
      name,
    }
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
}

export { Content, ProcessCounter, MediaDownloader }
