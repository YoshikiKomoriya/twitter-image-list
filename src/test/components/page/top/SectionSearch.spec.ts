import { Wrapper } from '@vue/test-utils'
import SearchBarKeyword from '~/components/form/SearchBarKeyword.vue'
import SectionSearch from '~/components/page/top/SectionSearch.vue'
import { shallowMount } from '~/test/util/mount'

describe('トップページ内のキーワード検索ブロック', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = shallowMount(SectionSearch)
  })

  test('検索バーの表示', () => {
    const searchBar = wrapper.findComponent(SearchBarKeyword)
    expect(searchBar.exists()).toBe(true)
  })
})
