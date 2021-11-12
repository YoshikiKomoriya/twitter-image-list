import { Wrapper } from '@vue/test-utils'
import TweetWrapper from '~/components/display/TweetWrapper.vue'
import { shallowMount } from '~/test/util/mount'

describe('メディアダウンロードボタン', () => {
  let wrapper: Wrapper<Vue>
  const props = { statuses: [] }

  beforeEach(() => {
    wrapper = shallowMount(TweetWrapper, { propsData: props })
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
