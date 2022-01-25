/**
 * メディアのダウンロードを実施するクラス
 */

import axios, { CancelToken } from 'axios'
import { MediaDownloadError } from '~/modules/customError'
import { Content, MediaInformation } from '~/modules/mediaDownloader'

// エラー返却時に用いるデータ用の型設定
type ErrorData = { reason: string; media: MediaInformation }

/**
 * メディアのダウンロードを実施するクラス
 */
class MediaDownloadQueue {
  /**
   * ダウンロード処理のキャンセル用トークン
   */
  private readonly _cancelToken: CancelToken

  /**
   * コンストラクタ
   * @param cancelToken ダウンロード処理のキャンセル用トークン
   */
  constructor(cancelToken: CancelToken) {
    this._cancelToken = cancelToken
  }

  /**
   * 指定のメディア一覧をダウンロードする
   * @param medias メディア情報
   * @returns ダウンロードに成功したメディア一覧・失敗したメディア一覧
   */
  async download(medias: MediaInformation[]) {
    // 処理速度を速めるために、並列実行を行なっている
    const promises = this._generatePromisesForDownload(medias)
    const results = await Promise.allSettled(promises) // エラー発生時に個別に処理したいため、all()ではなくallSettled()を使用している

    // 成功したもの/失敗したものに分類する
    const resolves: Content[] = []
    const rejects: MediaDownloadError[] = []
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        resolves.push(result.value)
        return
      }
      rejects.push(result.reason)
    })

    return { resolves, rejects }
  }

  /**
   * メディアのコンテンツを並列処理でダウンロードするために、Promiseを生成する
   * @param medias メディア情報
   * @returns ダウンロード処理が格納されたPromiseの一覧
   * @throws {@link MediaDownloadError} データを取得できなかった（200以外のレスポンスが返ってきた）場合
   * @throws {@link MediaDownloadError} データ取得がキャンセルされた場合
   * @throws {@link MediaDownloadError} 通信処理に失敗した（Axiosによる通信が成功しなかった）場合
   */
  private _generatePromisesForDownload(medias: MediaInformation[]) {
    return medias.map(async (media) => {
      return await this._downloadContent(media)
    })
  }

  /**
   * メディアのダウンロードを行う
   * @param media ダウンロード対象となるメディア
   * @param cancelToken 通信キャンセル用のトークン
   * @returns ダウンロードされたメディア
   * @throws {@link MediaDownloadError} データを取得できなかった（200以外のレスポンスが返ってきた）場合
   * @throws {@link MediaDownloadError} データ取得がキャンセルされた場合
   * @throws {@link MediaDownloadError} 通信処理に失敗した（Axiosによる通信が成功しなかった）場合
   */
  private async _downloadContent(media: MediaInformation): Promise<Content> {
    // データの取得処理を生成する
    const data = await axios
      .get(media.url, {
        responseType: 'blob',
        cancelToken: this._cancelToken,
      })
      .then((response) => {
        // データが取得できた場合、指定の形式で返却する
        if (response.status === 200) {
          const blob = new Blob([response.data], {
            type: response.data.type,
          })
          return {
            name: media.name,
            blob,
          }
        }

        // データが取得できなかった場合、エラーとする
        const data: ErrorData = {
          reason: `status code : ${response.status}`,
          media,
        }
        throw new MediaDownloadError({
          message: 'データを取得できませんでした',
          data,
        })
      })
      .catch((reason) => {
        // キャンセル済みの場合、その旨を記載したエラーとする
        if (axios.isCancel(reason)) {
          const data: ErrorData = { reason: 'canceled', media }
          throw new MediaDownloadError({
            message: 'キャンセルされました',
            data,
          })
        }

        // 何らかの理由でデータが取得できなかった場合、エラーとする
        const data: ErrorData = { reason: reason.message, media }
        throw new MediaDownloadError({
          message: '通信処理に失敗しました',
          data,
        })
      })

    return data
  }
}

export { MediaDownloadQueue }
