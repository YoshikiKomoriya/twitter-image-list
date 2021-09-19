import { Wrapper } from '@vue/test-utils'
import { shallowMount } from '~/test/util/mount'
import Footer from '~/components/navigation/Footer.vue'
import { links } from '~/components/navigation/links'

describe('フッター', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = shallowMount(Footer)
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
