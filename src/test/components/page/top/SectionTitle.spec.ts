import { Wrapper } from '@vue/test-utils'
import { shallowMount } from '~/test/util/mount'
import SectionTitle from '~/components/page/top/SectionTitle.vue'
import Logo from '~/components/display/Logo.vue'

describe('トップページ内のタイトルブロック', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = shallowMount(SectionTitle)
  })

  test('h1タグの表示', () => {
    const h1 = wrapper.get('h1')
    expect(h1.text()).toBe('Twitter画像検索&ダウンロード')
  })

  /**
   * findComponent() は wrapper でしか使えない様子なので、以下の検証方法を組み合わせて代替する
   * 1. h2 タグ内に logo-stub タグが存在する
   * 2. タイトルブロックのコンポーネント中に Logo コンポーネントが存在する
   *
   * 以下、h2.findComponent(Logo)を試した場合に出たエラー文言
   * > Error: [vue-test-utils]: You cannot chain findComponent off a DOM element. It can only be used on Vue Components.Jest
   */
  test('h2（ロゴ画像）の表示', () => {
    const h2 = wrapper.get('h2')
    const logo = h2.get('logo-stub')
    expect(logo.exists()).toBe(true)

    const logoComponents = wrapper.findComponent(Logo)
    expect(logoComponents.exists()).toBe(true)
  })
})
