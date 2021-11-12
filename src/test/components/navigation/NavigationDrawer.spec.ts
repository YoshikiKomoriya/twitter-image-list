import { Wrapper } from '@vue/test-utils'
import NavigationDrawer from '~/components/navigation/NavigationDrawer.vue'
import { links } from '~/preferences/links'
import { shallowMount } from '~/test/util/mount'

describe('ナビゲーションドロワー', () => {
  let wrapper: Wrapper<Vue>
  const props = {
    drawer: false,
  }

  beforeEach(() => {
    wrapper = shallowMount(NavigationDrawer, { propsData: props })
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

  test('ドロワー表示用モデルを変更する関数のテスト', () => {
    expect(wrapper.emitted('update:drawer')).toBeUndefined()

    /**
     * コンポーネント内の関数にアクセスするために、型定義を行う
     * '@vue/test-utils'で関数を使う場合に、検証可能な形で処理を実行するために実施している
     * （trigger()ではemitted()で出力される履歴にデータが追加されない）
     *
     * wrapper.vmによってアクセスできるVueインスタンスには、コンポーネント内で定義されたプロパティの型情報が存在しないため、ここで追加している
     *
     * @todo より*読みやすい*・*書きやすい（自動化されている）*形を検討して、そちらの方法を採用する
     * @note https://github.com/vuejs/vue-test-utils/issues/255
     */
    type NavigationDrawerType = typeof NavigationDrawer
    interface ExtendedComponent extends NavigationDrawerType {
      dispatchInputEvent: Function
    }
    const vm = wrapper.vm as unknown as ExtendedComponent
    vm.dispatchInputEvent(true)

    expect(wrapper.emitted('update:drawer')).toBeTruthy()
  })
})
