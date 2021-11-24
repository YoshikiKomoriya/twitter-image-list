import { Wrapper } from '@vue/test-utils'
import ButtonLogin from '~/components/general/ButtonLogin.vue'
import login from '~/pages/login.vue'
import { mount } from '~/test/util/mount'

describe('ご利用上の注意', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = mount(login)
  })

  test('h1タグの表示', () => {
    const h1 = wrapper.get('h1')
    expect(h1.text()).toBe('アカウントサービス')
  })

  test('ログインボタンの表示', () => {
    const buttonLogin = wrapper.findComponent(ButtonLogin)
    expect(buttonLogin.exists()).toBe(true)
  })

  test('Markdownファイルの表示', () => {
    // NuxtContentのコンテンツ表示はライブラリによってテストされているため、ユニットテストではスタブが表示されているかだけ確認する
    const nuxtContents = wrapper.find('.nuxt-content')
    expect(nuxtContents.exists()).toBe(true)
  })
})
