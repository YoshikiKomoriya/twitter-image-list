import { Wrapper } from '@vue/test-utils'
import { shallowMount } from '~/test/util/mount'
import SectionSearch from '~/components/page/top/SectionSearch.vue'
import SearchKeyword from '~/components/form/SearchKeyword.vue'

describe('トップページ内のキーワード検索ブロック', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = shallowMount(SectionSearch)
  })

  test('検索バーの表示', () => {
    const searchBar = wrapper.findComponent(SearchKeyword)
    expect(searchBar.exists()).toBe(true)
  })
})
