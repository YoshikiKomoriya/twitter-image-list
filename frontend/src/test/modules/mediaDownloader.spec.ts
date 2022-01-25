import axios, { Cancel } from 'axios'
import { MediaDownloadError } from '~/modules/customError'
import { MediaDownloadQueue } from '~/modules/mediaDownloadQueue'
import { MediaDownloader, ProcessCounter } from '~/modules/mediaDownloader'
import { env } from '~/test/util/dotenv'
import { Media, ResponseSearchTweets } from '~openapi/generated/src'

describe('メディアダウンロード用クラス', () => {
  // モックサーバーに接続して、ダウンロード対象のメディアを取得する
  const mockServerOrigin = env.get('MOCK_SERVER_URL')
  let medias: Media[]

  beforeEach(async () => {
    const response: ResponseSearchTweets = (
      await axios.get(`${mockServerOrigin}/search/tweets/video`)
    ).data
    const existsMediaTweets = response.statuses.filter((tweet) => {
      return tweet.extended_entities !== undefined
    })
    medias = existsMediaTweets
      .map((tweet) => {
        return tweet.extended_entities!.media // 前述のフィルター処理でextended_entitiesの存在確認をしている前提
      })
      .flat()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('ダウンロード処理', () => {
    test('指定のメディアをダウンロードできる', async () => {
      const download = jest.spyOn(MediaDownloadQueue.prototype, 'download')
      const result = {
        resolves: [
          { name: 'media1', blob: new Blob() },
          { name: 'media2', blob: new Blob() },
        ],
        rejects: [],
      }
      download.mockResolvedValue(result)

      const downloader = new MediaDownloader(medias)
      await downloader.download()

      expect(downloader.contents).toEqual(result.resolves)
    })
    test('同時にダウンロードする数を指定できる', async () => {
      const download = jest
        .spyOn(MediaDownloadQueue.prototype, 'download')
        .mockResolvedValue({
          resolves: [{ name: 'media', blob: new Blob() }],
          rejects: [],
        })

      // 1件ずつダウンロードするよう指定して、ダウンロード用関数がメディアの数だけ呼び出されるかどうかを確認する
      const downloader = new MediaDownloader(medias, 1)
      await downloader.download()

      expect(download).toBeCalledTimes(medias.length)
    })
    test('カウンターを指定すると、ダウンロード後に更新される', async () => {
      jest.spyOn(MediaDownloadQueue.prototype, 'download').mockResolvedValue({
        resolves: [{ name: 'media', blob: new Blob() }],
        rejects: [],
      })
      const counter: ProcessCounter = { processed: 0, total: 0 }

      /**
       * 総計5件に対して3件ずつ処理を行い、以下の状態を確認する
       * - 3件分ずつ更新される
       * - 最大値を超えてしまう場合、最大値で更新される
       */
      const targetLength = 5
      const slicedMedias = Array.from({ length: targetLength }, () => {
        return medias[0]
      })

      const downloader = new MediaDownloader(slicedMedias, 3)
      await downloader.download(counter)

      expect(counter.total).toBe(slicedMedias.length)
      expect(counter.processed).toBe(slicedMedias.length)
    })
  })

  describe('エラー処理', () => {
    test('ダウンロード対象となるメディアが0件の場合、エラーが発生する', () => {
      const downloader = new MediaDownloader([])
      expect(downloader.download()).rejects.toThrow(
        new MediaDownloadError('ダウンロード可能なメディアが存在しません'),
      )
    })

    test('メディアの種別が動画だが、動画情報が含まれていないものが存在する場合、エラーが記録される', () => {
      // エラーとなるメディア情報を作成
      const errorMedia: Media = JSON.parse(JSON.stringify(medias[0]))
      errorMedia.type = 'video'
      errorMedia.video_info = undefined

      // 解析結果の検証
      const downloader = new MediaDownloader([errorMedia])
      expect(downloader.errors[0]).toEqual(
        new MediaDownloadError({
          message: '動画情報が見つかりませんでした',
          data: errorMedia.expanded_url,
        }),
      )
    })
  })

  describe('結果の取得', () => {
    test('ダウンロード中に発生したエラーが一覧で取得できる', async () => {
      const download = jest.spyOn(MediaDownloadQueue.prototype, 'download')
      const result = {
        resolves: [],
        rejects: [
          new MediaDownloadError('メディアのダウンロードに失敗しました'),
          new MediaDownloadError({
            message: 'メディアのダウンロードに失敗しました',
            data: { infomation: 'メディア情報' },
          }),
        ],
      }
      download.mockResolvedValue(result)

      const downloader = new MediaDownloader(medias)
      await downloader.download()

      expect(downloader.errors).toEqual(result.rejects)
    })
    test('ダウンロードしたメディアが一覧で取得できる', async () => {
      const download = jest.spyOn(MediaDownloadQueue.prototype, 'download')
      const result = {
        resolves: [
          { name: 'media1', blob: new Blob() },
          { name: 'media2', blob: new Blob() },
        ],
        rejects: [],
      }
      download.mockResolvedValue(result)

      const downloader = new MediaDownloader(medias)
      await downloader.download()

      expect(downloader.contents).toEqual(result.resolves)
    })
  })

  describe('キャンセル（リセット）処理', () => {
    test('キャンセル処理が可能である', () => {
      // axiosのキャンセル処理をモック化する
      const promise: Promise<Cancel> = new Promise((resolve) => {
        resolve(new axios.Cancel('cancel.'))
      })
      const cancelTokenSource = {
        cancel: jest.fn(),
        token: {
          reason: { message: 'canceled.' },
          promise,
          throwIfRequested: jest.fn(),
        },
      }
      jest
        .spyOn(axios.CancelToken, 'source')
        .mockReturnValueOnce(cancelTokenSource)

      // キャンセル処理の実施
      const downloader = new MediaDownloader(medias)
      downloader.abort()

      expect(cancelTokenSource.cancel).toBeCalled()
    })
    test('リセット処理を行うと、キャンセル処理・ダウンロード先メディアのリセット・ダウンロード済みメディアの初期化・エラー一覧の初期化が行われる', async () => {
      // テスト向けに各関数をモック化
      const download = jest.spyOn(MediaDownloadQueue.prototype, 'download')
      const result = {
        resolves: [
          { name: 'media1', blob: new Blob() },
          { name: 'media2', blob: new Blob() },
        ],
        rejects: [
          new MediaDownloadError('メディアのダウンロードに失敗しました'),
          new MediaDownloadError({
            message: 'メディアのダウンロードに失敗しました',
            data: { infomation: 'メディア情報' },
          }),
        ],
      }
      download.mockResolvedValue(result)

      const promise: Promise<Cancel> = new Promise((resolve) => {
        resolve(new axios.Cancel('cancel.'))
      })
      const cancelTokenSource = {
        cancel: jest.fn(),
        token: {
          reason: { message: 'canceled.' },
          promise,
          throwIfRequested: jest.fn(),
        },
      }
      jest
        .spyOn(axios.CancelToken, 'source')
        .mockReturnValueOnce(cancelTokenSource)

      const abort = jest.spyOn(MediaDownloader.prototype, 'abort')

      // ダウンロードの実施
      const downloader = new MediaDownloader(medias)
      await downloader.download()

      // ダウンロード結果の検証
      expect(downloader.contents).toEqual(result.resolves)
      expect(downloader.errors).toEqual(result.rejects)

      // リセットの実施
      downloader.reset()

      // リセット結果の検証
      expect(abort).toBeCalled()
      expect(downloader.download()).rejects.toThrow(
        new MediaDownloadError('ダウンロード可能なメディアが存在しません'),
      )
      expect(downloader.contents.length).toBe(0)
      expect(downloader.errors.length).toBe(0)
    })
  })
})
