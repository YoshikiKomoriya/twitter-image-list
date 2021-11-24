import { Wrapper } from '@vue/test-utils'
import axios from 'axios'

import TweetCardVideo from '~/components/display/TweetCardVideo.vue'
import { filterTweetsToExistMedia } from '~/modules/mediaFilter'
import { selectHighestAndLowest } from '~/modules/videoVariant'
import { env } from '~/test/util/dotenv'
import { mount, shallowMount } from '~/test/util/mount'
import { Media, Tweet } from '~openapi/generated/src'

/**
 * コンポーネントのpropsに設定するデータを取得する
 * @returns propsに設定するデータ
 */
const getPropsData = async () => {
  const mockServerOrigin = env.get('MOCK_SERVER_URL')
  const response = await (
    await axios.get(`${mockServerOrigin}/search/tweets/video`)
  ).data
  const statuses = filterTweetsToExistMedia(response.statuses)

  if (statuses[0].extended_entities === undefined) {
    throw new Error(
      'テストデータのツイート一覧に、メディア情報が含まれるツイートが存在しません',
    )
  }

  const props = {
    media: statuses[0].extended_entities.media[0],
    status: statuses[0],
  }

  return props
}

describe('ツイート動画表示用ブロック', () => {
  let wrapper: Wrapper<Vue>
  let props: { media: Media; status: Tweet }

  beforeEach(async () => {
    props = await getPropsData()
    wrapper = shallowMount(TweetCardVideo, {
      propsData: props,
    })
  })

  test('動画が表示される', () => {
    // 動画情報の取得
    if (props.media.video_info === undefined) {
      throw new Error('動画情報を取得できませんでした')
    }
    const variants = selectHighestAndLowest(props.media.video_info.variants)

    // 動画の表示設定
    const video = wrapper.find('video-player-stub')
    expect(video.attributes('src')).toBe(variants.lowest.url)
  })

  test('情報ボタンのクリック時にツイート情報が展開される', async () => {
    // クリックイベントの発火を確認したいため、スタブ化を行わないmount()を使う
    const mountedWrapper = mount(TweetCardVideo, {
      propsData: props,
    })

    const information = mountedWrapper.find('div.v-card__text')
    expect(information.isVisible()).toBe(false)

    const button = mountedWrapper.find('button.v-btn i.mdi-information')

    // 毎回必ず切り替わる（複数回切り替えても規定の動作を繰り返し続ける）ことを検証する
    for (let i = 0; i > 10; i++) {
      const target = i % 2 === 0 // 偶数の場合にtrue, そうでない場合にfalse

      await button.trigger('click')
      expect(information.isVisible()).toBe(target)
    }
  })

  test('元画像へのリンクURLが設定されている', () => {
    // 動画情報の取得
    if (props.media.video_info === undefined) {
      throw new Error('動画情報を取得できませんでした')
    }
    const variants = selectHighestAndLowest(props.media.video_info.variants)

    // URLの検証
    const actions = wrapper.find('tweet-card-actions-stub')
    expect(actions.attributes('mediahref')).toBe(variants.highest.url)
  })

  test('元ツイートへのリンクURLが設定されている', () => {
    const actions = wrapper.find('tweet-card-actions-stub')
    expect(actions.attributes('tweethref')).toBe(props.media.expanded_url)
  })

  test('propsで指定されたメディア情報に動画情報が含まれていない場合、エラーが発生する', () => {
    const testProps: { media: Media; status: Tweet } = JSON.parse(
      JSON.stringify(props),
    )
    testProps.media.video_info = undefined

    /**
     * shallowMount()でVueのエラーが発生する場合、expect().toThrow()で捕捉していても、コンソールに対してログが出力されてしまう
     * 出力機能をモック化することで、ログの出力を無効化する
     */
    jest.spyOn(console, 'error').mockReturnValue()

    expect(() => {
      shallowMount(TweetCardVideo, { propsData: testProps })
    }).toThrow(TypeError('メディアに動画情報が含まれていません'))

    jest.clearAllMocks()
  })

  test('ツイート情報表示用モデルを変更する関数のテスト', () => {
    expect(wrapper.vm.$data.show).toBe(false)

    /**
     * コンポーネント内の関数にアクセスするために、型定義を行う
     * '@vue/test-utils'で関数を使う場合に、検証可能な形で処理を実行するために実施している
     * （trigger()ではemitted()で出力される履歴にデータが追加されない）
     *
     * wrapper.vmによってアクセスできるVueインスタンスには、コンポーネント内で定義されたプロパティの型情報が存在しないため、ここで追加している
     *
     * @todo より*読みやすい*・*書きやすい（自動化されている）*形を検討して、そちらの方法を採用する
     * @note https://github.com/vuejs/vue-test-utils/issues/255
     */
    type TweetCardVideoType = typeof TweetCardVideo
    interface ExtendedComponent extends TweetCardVideoType {
      toggleShow: Function
    }
    const vm = wrapper.vm as unknown as ExtendedComponent
    vm.toggleShow()

    expect(wrapper.vm.$data.show).toBe(true)
  })
})
