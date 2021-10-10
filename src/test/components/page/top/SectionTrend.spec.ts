import { Wrapper } from '@vue/test-utils'
import { shallowMount } from '~/test/util/mount'
import SectionTrend from '~/components/page/top/SectionTrend.vue'
import { encodeQuery } from '~/plugins/query'

describe('トップページ内のトレンドブロック', () => {
  let wrapper: Wrapper<Vue>

  // 仮のデータとして置いている
  // TODO: トレンド関係の機能の実装後、コンポーネントとデータの共通化を行う
  const trends = [
    'Work',
    'Home Improvement',
    'Vacation',
    'Food',
    'Drawers',
    'Shopping',
    'Art',
    'Tech',
    'Creative Writing',
  ]

  beforeEach(() => {
    wrapper = shallowMount(SectionTrend)
  })

  test('h2タグの表示', () => {
    const h2 = wrapper.get('h2')
    expect(h2.text()).toBe('トレンドから検索する')
  })

  test('トレンドキーワードの表示', () => {
    const chipGroup = wrapper.get('v-chip-group-stub')
    const chips = chipGroup.findAll('v-chip.stub')

    for (let i = 0; i < chips.length; i++) {
      expect(chips.at(i).text()).toBe(trends[i])
    }
  })

  test('トレンドのボタンがリンクになっている', () => {
    const chipGroup = wrapper.get('v-chip-group-stub')
    const chips = chipGroup.findAll('v-chip.stub')

    for (let i = 0; i < chips.length; i++) {
      const encodedKeyword = encodeQuery(trends[i])
      const to = `/keyword/${encodedKeyword}`
      expect(chips.at(i).attributes('to')).toBe(to)
    }
  })
})
