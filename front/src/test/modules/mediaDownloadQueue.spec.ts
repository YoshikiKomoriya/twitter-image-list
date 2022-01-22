import axios, { CancelTokenSource } from 'axios'
import {
  getOriginal,
  getFileName as getImageFileName,
} from '~/modules/imageUrl'
import { MediaDownloadQueue } from '~/modules/mediaDownloadQueue'
import { MediaInformation } from '~/modules/mediaDownloader'
import { getFileName as getVideoFileName } from '~/modules/videoUrl'
import { selectHighest } from '~/modules/videoVariant'
import { isPhoto } from '~/preferences/mediaType'
import { env } from '~/test/util/dotenv'
import { ResponseSearchTweets } from '~openapi/generated/src'

describe('メディアダウンロード処理クラス', () => {
  // モックサーバーに接続して、ダウンロード対象のメディアを取得する
  const mockServerOrigin = env.get('MOCK_SERVER_URL')
  let mediaInformations: MediaInformation[]
  let cancelTokenSource: CancelTokenSource

  beforeEach(async () => {
    const response: ResponseSearchTweets = (
      await axios.get(`${mockServerOrigin}/search/tweets`)
    ).data
    const existsMediaTweets = response.statuses.filter((tweet) => {
      return tweet.extended_entities !== undefined
    })
    const medias = existsMediaTweets
      .map((tweet) => {
        return tweet.extended_entities!.media // 前述のフィルター処理でextended_entitiesの存在確認をしている前提
      })
      .flat()
    mediaInformations = medias.map((media) => {
      if (isPhoto(media.type)) {
        return {
          url: getOriginal(media.media_url_https),
          name: getImageFileName(media.media_url_https),
        }
      }

      const url = selectHighest(media.video_info!.variants).url
      return {
        url,
        name: getVideoFileName(url),
      }
    })

    cancelTokenSource = axios.CancelToken.source()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('ダウンロード処理', () => {
    test('指定のメディアをダウンロードできる', async () => {
      const response = {
        status: 200,
        data: 'test',
      }
      jest.spyOn(axios, 'get').mockResolvedValue(response)

      const queue = new MediaDownloadQueue(cancelTokenSource.token)
      const result = await queue.download(mediaInformations)

      expect(result.resolves.length).toBeGreaterThan(0)
      expect(result.resolves.length).toBe(mediaInformations.length)
      expect(result.rejects.length).toBe(0)

      for (let i = 0; i < result.resolves.length; i++) {
        const data = result.resolves[i]

        expect(data.name).toBe(mediaInformations[i].name)
        expect(data.blob).toEqual(new Blob([response.data]))
      }
    })

    test('キャンセルされた場合、指定のエラーが記録される', async () => {
      jest.spyOn(axios, 'get')

      const queue = new MediaDownloadQueue(cancelTokenSource.token)
      cancelTokenSource.cancel()
      const result = await queue.download(mediaInformations)

      expect(result.resolves.length).toBe(0)
      expect(result.rejects.length).toBeGreaterThan(0)
      expect(result.rejects.length).toBe(mediaInformations.length)

      for (let i = 0; i < result.rejects.length; i++) {
        const error = result.rejects[i]

        expect(error.message).toBe('キャンセルされました')
        expect(error.data.reason).toBe('canceled')
        expect(error.data.media).toEqual(mediaInformations[i])
      }
    })

    test('何らかの理由（200番以外のレスポンスや通信の失敗等）でデータが取得できなかった場合、指定のエラーが記録される', async () => {
      const response = {
        status: 404,
        data: 'test',
      }
      jest.spyOn(axios, 'get').mockResolvedValue(response)

      const queue = new MediaDownloadQueue(cancelTokenSource.token)
      const result = await queue.download(mediaInformations)

      expect(result.resolves.length).toBe(0)
      expect(result.rejects.length).toBeGreaterThan(0)
      expect(result.rejects.length).toBe(mediaInformations.length)

      for (let i = 0; i < result.rejects.length; i++) {
        const error = result.rejects[i]

        expect(error.message).toBe('通信処理に失敗しました')
        expect(error.data.reason).toBe('データを取得できませんでした')
        expect(error.data.media).toEqual(mediaInformations[i])
      }
    })
  })
})
