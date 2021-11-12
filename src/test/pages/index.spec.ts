import index from '~/pages/index.vue'
import { mount, shallowMount } from '~/test/util/mount'

// トップページで参照している各コンポーネントのタグ名
const sections = [
  'section-title',
  'section-search',
  'section-trend',
  'section-information',
  'section-notice',
]

describe('トップページ', () => {
  test.each(sections)('各セクションの表示(%s)', (section) => {
    // 参照している各コンポーネントの内容はそれぞれのユニットテストで検証するため、展開しないようにshallowMountを選択している
    const wrapper = shallowMount(index)

    const component = wrapper.get(`${section}-stub`)
    expect(component.exists()).toBe(true)
  })

  test('Markdownファイルの表示', () => {
    const wrapper = mount(index)

    // NuxtContentのコンテンツ表示はライブラリによってテストされているため、ユニットテストではスタブが表示されているかだけ確認する
    const nuxtContents = wrapper.findAll('.nuxt-content')
    expect(nuxtContents.exists()).toBe(true)
  })
})
