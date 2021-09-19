import { Wrapper, RouterLinkStub } from '@vue/test-utils'
import { shallowMount } from '~/test/util/mount'
import Logo from '~/components/display/Logo.vue'

describe('ロゴ画像', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = shallowMount(Logo)
  })

  test('リンク先がトップページである', () => {
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.text()).toBe('')
    expect(link.props().to).toBe('/')
  })

  test('ロゴ画像の表示', () => {
    const image = wrapper.find('v-img-stub')
    expect(image.attributes('src')).toBe('/logo.svg')
    expect(image.attributes('alt')).toBe('Twistter（Twitter Image List）')
  })

  test('横幅（width）の指定', async () => {
    // 初期値
    const defaultImage = wrapper.find('v-img-stub')
    expect(defaultImage.attributes('width')).toBe('15rem')

    // 設定の追加
    const props = { width: '10rem' }
    await wrapper.setProps(props)

    const image = wrapper.find('v-img-stub')
    expect(image.attributes('width')).toBe(props.width)
  })
})
