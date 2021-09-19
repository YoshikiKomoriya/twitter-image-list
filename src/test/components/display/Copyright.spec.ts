import { Wrapper } from '@vue/test-utils'
import { shallowMount } from '~/test/util/mount'
import Copyright from '~/components/display/Copyright.vue'

describe('コピーライト', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = shallowMount(Copyright)
  })

  test('表示される文言', () => {
    const year = new Date().getFullYear()

    expect(wrapper.text()).toBe(`© ${year}`)
  })

  test('年数の変化', async () => {
    // 現在の年数
    const date = new Date()
    const year = date.getFullYear()
    expect(wrapper.text()).toBe(`© ${year}`)

    // 1年後
    date.setFullYear(year + 1)
    const oneYearLater = date.getFullYear()
    await wrapper.setData({ year: oneYearLater })
    expect(wrapper.text()).toBe(`© ${oneYearLater}`)

    // 10年後
    date.setFullYear(year + 10)
    const tenYearLater = date.getFullYear()
    await wrapper.setData({ year: tenYearLater })
    expect(wrapper.text()).toBe(`© ${tenYearLater}`)
  })
})
