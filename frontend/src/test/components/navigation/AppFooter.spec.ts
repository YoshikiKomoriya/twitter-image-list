import { Wrapper } from '@vue/test-utils'
import AppFooter from '~/components/navigation/AppFooter.vue'
import { links } from '~/preferences/links'
import { shallowMount } from '~/test/util/mount'

describe('フッター', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = shallowMount(AppFooter)
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
})
