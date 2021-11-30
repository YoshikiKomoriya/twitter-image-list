import { Wrapper } from '@vue/test-utils'
import axios from 'axios'
import TweetWrapper from '~/components/display/TweetWrapper.vue'
import { env } from '~/test/util/dotenv'
import { shallowMount } from '~/test/util/mount'
import { ResponseSearchTweets, Tweet } from '~openapi/generated/src'

describe('メディアダウンロードボタン', () => {
  let wrapper: Wrapper<Vue>

  // モックサーバーに接続して、ダウンロード対象のメディアを取得する
  const mockServerOrigin = env.get('MOCK_SERVER_URL')
  let tweets: Tweet[]

  beforeEach(async () => {
    const response: ResponseSearchTweets = (
      await axios.get(`${mockServerOrigin}/search/tweets/image`)
    ).data
    tweets = response.statuses
  })

  beforeEach(() => {
    wrapper = shallowMount(TweetWrapper, { propsData: { statuses: tweets } })
  })

  describe('関数の検証', () => {
    test('ツイートのメディアが画像であるか判定する関数のテスト', () => {
      /**
       * コンポーネント内の関数にアクセスするために、型定義を行う
       * '@vue/test-utils'で関数を使う場合に、検証可能な形で処理を実行するために実施している
       * wrapper.vmによってアクセスできるVueインスタンスには、コンポーネント内で定義されたプロパティの型情報が存在しないため、ここで追加している
       *
       * @todo より*読みやすい*・*書きやすい（自動化されている）*形を検討して、そちらの方法を採用する
       * @note https://github.com/vuejs/vue-test-utils/issues/255
       */
      type TweetWrapperType = typeof TweetWrapper
      interface ExtendedComponent extends TweetWrapperType {
        isPhoto: (type: string) => boolean
      }
      const vm = wrapper.vm as unknown as ExtendedComponent

      expect(vm.isPhoto('photo')).toBe(true)
      expect(vm.isPhoto('video')).toBe(false)
    })
  })
})
