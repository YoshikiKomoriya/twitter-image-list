import { Wrapper } from '@vue/test-utils'
import axios from 'axios'
import TweetCardImage from '~/components/display/TweetCardImage.vue'
import { filterTweetsToExistMedia } from '~/modules/mediaFilter'
import { parameter } from '~/preferences/tweetImage'
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
    await axios.get(`${mockServerOrigin}/search/tweets/image`)
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

describe('ツイート画像表示用ブロック', () => {
  let wrapper: Wrapper<Vue>
  let props: { media: Media; status: Tweet }

  beforeEach(async () => {
    props = await getPropsData()
    wrapper = shallowMount(TweetCardImage, {
      propsData: props,
    })
  })

  test('画像が表示される', () => {
    const image = wrapper.find('v-img-stub')

    // 画像の基本設定
    const alt = props.media.ext_alt_text || props.status.full_text
    expect(image.attributes('alt')).toBe(alt)
    expect(image.attributes('src')).toBe(
      `${props.media.media_url_https}?name=${parameter.small.name}`,
    )

    // 画像の表示方法に関する設定
    expect(image.attributes('contain')).toBe('true')
    expect(image.attributes('aspectratio')).toBe('1')
    expect(image.attributes('maxwidth')).toBe('100vw')
  })

  test('サムネイル画像のクリック時にツイート情報が展開される', async () => {
    // クリックイベントの発火を確認したいため、スタブ化を行わないmount()を使う
    const mountedWrapper = mount(TweetCardImage, {
      propsData: props,
    })

    const information = mountedWrapper.find('div.v-card__text')
    expect(information.isVisible()).toBe(false)

    const thumbnail = mountedWrapper.find('div.v-image[role="img"]')

    // 毎回必ず切り替わる（複数回切り替えても規定の動作を繰り返し続ける）ことを検証する
    for (let i = 0; i > 10; i++) {
      const target = i % 2 === 0 // 偶数の場合にtrue, そうでない場合にfalse

      await thumbnail.trigger('click')
      expect(information.isVisible()).toBe(target)
    }
  })

  test('元画像へのリンクURLが設定されている', () => {
    const actions = wrapper.find('tweet-card-actions-stub')
    expect(actions.attributes('mediahref')).toBe(
      `${props.media.media_url_https}?name=${parameter.original.name}`,
    )
  })

  test('元ツイートへのリンクURLが設定されている', () => {
    const actions = wrapper.find('tweet-card-actions-stub')
    expect(actions.attributes('tweethref')).toBe(props.media.expanded_url)
  })

  test('ツイート情報表示用モデルを変更する関数のテスト', () => {
    expect(wrapper.vm.$data.show).toBe(false)

    /**
     * コンポーネント内の関数にアクセスするために、型定義を行う
     * '@vue/test-utils'で関数を使う場合に、検証可能な形で処理を実行するために実施している
     * wrapper.vmによってアクセスできるVueインスタンスには、コンポーネント内で定義されたプロパティの型情報が存在しないため、ここで追加している
     *
     * @todo より*読みやすい*・*書きやすい（自動化されている）*形を検討して、そちらの方法を採用する
     * @note https://github.com/vuejs/vue-test-utils/issues/255
     */
    type TweetCardImageType = typeof TweetCardImage
    interface ExtendedComponent extends TweetCardImageType {
      toggleShow: Function
    }
    const vm = wrapper.vm as unknown as ExtendedComponent
    vm.toggleShow()

    expect(wrapper.vm.$data.show).toBe(true)
  })
})
