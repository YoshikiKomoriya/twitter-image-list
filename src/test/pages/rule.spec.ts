import { Wrapper } from '@vue/test-utils'
import { mount } from '~/test/util/mount'
import rule from '~/pages/rule.vue'

describe('ご利用上の注意', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = mount(rule)
  })

  test('h1タグの表示', () => {
    const h1 = wrapper.get('h1')
    expect(h1.text()).toBe('ご利用上の注意')
  })

  test('Markdownファイルの表示', () => {
    // NuxtContentのコンテンツ表示はライブラリによってテストされているため、ユニットテストではスタブが表示されているかだけ確認する
    const nuxtContents = wrapper.findAll('.nuxt-content')
    expect(nuxtContents.wrappers.length).toBe(2)
  })
})
