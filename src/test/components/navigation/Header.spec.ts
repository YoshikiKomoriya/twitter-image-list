// import { shallowMount } from '~/test/util/mount'
import { Wrapper } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Header from '~/components/navigation/Header.vue'
import { links } from '~/components/navigation/links'
import { shallowMount } from '~/test/util/mount'

describe('ヘッダー（PC表示）', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    // PC表示を確認したいため、ブレークポイントの指定を行う
    const vuetify = new Vuetify({
      breakpoint: {
        mobileBreakpoint: 0,
      },
    })
    wrapper = shallowMount(Header, { vuetify })
  })

  test('リンク先の検証', () => {
    const linkButtons = wrapper.findAll('nav v-btn-stub')
    expect(linkButtons.wrappers.length).toBeGreaterThan(0)

    for (let i = 0; i < linkButtons.wrappers.length; i++) {
      const linkButton = linkButtons.at(i)
      const data = links[i]

      expect(linkButton.props().to).toBe(data.path)
      expect(linkButton.text()).toBe(data.title)
    }
  })

  test('ナビゲーションアイコンが表示されない', () => {
    const icon = wrapper.find('v-app-bar-nav-icon-stub')
    expect(icon.exists()).toBe(false)
  })
})

describe('ヘッダー（モバイル表示）', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    // モバイル表示を確認したいため、ブレークポイントの指定を行う
    const vuetify = new Vuetify({
      breakpoint: {
        mobileBreakpoint: 'lg',
      },
    })
    wrapper = shallowMount(Header, { vuetify })
  })

  test('リンクが表示されない', () => {
    const linkButtons = wrapper.findAll('nav v-btn-stub')
    expect(linkButtons.exists()).toBe(false)
  })

  test('ナビゲーションアイコンのクリック時、親コンポーネントに対するイベントが発生する', async () => {
    const icon = wrapper.find('v-app-bar-nav-icon-stub')
    await icon.trigger('click')
    expect(wrapper.emitted('input')).toBeTruthy()
  })
})
