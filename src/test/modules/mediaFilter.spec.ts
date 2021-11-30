import axios from 'axios'
import {
  filterTweetsToExistMedia,
  mapMediasByTweets,
} from '~/modules/mediaFilter'
import { mediaType } from '~/preferences/mediaType'
import { env } from '~/test/util/dotenv'
import { ResponseSearchTweets, Tweet } from '~openapi/generated/src'

describe('メディア情報に関する抽出処理', () => {
  // モックサーバーに接続して、ダウンロード対象のメディアを取得する
  const mockServerOrigin = env.get('MOCK_SERVER_URL')
  let statuses: Tweet[]

  // テスト用の評価関数
  const isNotExistMedia = (statuses: Tweet[]) => {
    return statuses.some((tweet) => {
      // メディア情報が存在しない場合
      if (tweet.extended_entities === undefined) {
        return true
      }

      // メディアの種別が規定外の場合、メディア情報が存在しないと見なす
      const acceptableTypes: string[] = Object.values(mediaType) // Array.includes()を使うために、文字列を受け付ける配列として定義する
      const media = tweet.extended_entities.media[0]

      if (acceptableTypes.includes(media.type) === false) {
        return true
      }

      // 動画情報が存在しない場合、メディア情報が存在しないと見なす
      if (
        media.type === mediaType.video ||
        media.type === mediaType.animatedGif
      ) {
        return media.video_info === undefined
      }

      return false
    })
  }

  beforeEach(async () => {
    const response: ResponseSearchTweets = (
      await axios.get(`${mockServerOrigin}/search/tweets`)
    ).data

    // メディア情報が存在しないデータを作成する
    const notExist: Tweet = JSON.parse(JSON.stringify(response.statuses[0]))
    notExist.extended_entities = undefined
    notExist.entities.media = undefined

    // テストデータの作成
    statuses = response.statuses.concat([notExist])
  })

  test('メディア情報が存在するツイートのみ抽出する', () => {
    // 初期状態の確認（メディア情報が存在しないツイートが含まれる）
    expect(isNotExistMedia(statuses)).toBe(true)

    // 検証の実施
    const filteredStatuses = filterTweetsToExistMedia(statuses)
    expect(isNotExistMedia(filteredStatuses)).toBe(false)
  })

  test('メディア情報のみの配列を作成する', () => {
    const mapppedTweet = mapMediasByTweets(statuses)
    mapppedTweet.forEach((media) => {
      if (media.type === mediaType.photo) {
        expect(media.media_url_https).toBeTruthy()
        return
      }

      if (
        media.type === mediaType.video ||
        media.type === mediaType.animatedGif
      ) {
        expect(media.video_info).toBeTruthy()
        return
      }

      throw new Error('想定外のメディア情報が含まれています')
    })
  })
})
