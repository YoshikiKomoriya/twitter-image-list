import { Wrapper } from '@vue/test-utils'
import { shallowMount } from '~/test/util/mount'
import NavigationDrawer from '~/components/navigation/NavigationDrawer.vue'
import { links } from '~/components/navigation/links'

describe('ナビゲーションドロワー', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = shallowMount(NavigationDrawer)
  })

  test('リンク先の検証', () => {
    const items = wrapper.findAll('v-list-item-stub')

    for (let i = 0; i < items.wrappers.length; i++) {
      const item = items.at(i)
      const data = links[i]

      expect(item.props().to).toBe(data.path)

      const icon = item.find('v-icon-stub')
      expect(icon.text()).toBe(data.icon)

      const title = item.find('v-list-item-title-stub')
      expect(title.text()).toBe(data.title)
    }
  })

  test('ドロワー表示用のモデルの変化', async () => {
    await wrapper.setProps({ drawer: true })
    expect(wrapper.attributes('value')).toBe('true')

    await wrapper.setProps({ drawer: false })
    expect(wrapper.attributes('value')).toBeUndefined()
  })
})
