import { Wrapper } from '@vue/test-utils'
import SectionInformation from '~/components/page/top/SectionInformation.vue'
import { shallowMount } from '~/test/util/mount'

describe('トップページ内のお知らせブロック', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = shallowMount(SectionInformation)
  })

  test('h2タグの表示', () => {
    const h2 = wrapper.get('h2')
    expect(h2.text()).toBe('お知らせ')
  })
})
