import { Wrapper } from '@vue/test-utils'
import CardAlert from '~/components/feedback/CardAlert.vue'
import { alertType } from '~/preferences/alertType'
import { shallowMount } from '~/test/util/mount'

describe('アラートコンポーネント', () => {
  let wrapper: Wrapper<Vue>

  const slots = {
    content: 'アラート文言',
  }

  beforeEach(() => {
    wrapper = shallowMount(CardAlert, { slots })
  })

  test('スロット（アラート文言）を指定', () => {
    const alert = wrapper.find('v-alert-stub')
    expect(alert.text()).toContain(slots.content)
  })

  test.each([
    { type: alertType.info },
    { type: alertType.success },
    { type: alertType.warning },
    { type: alertType.error },
  ])('アラートの種別が指定されている（%s）', async ({ type }) => {
    const props = { type }
    await wrapper.setProps(props)

    const alert = wrapper.find('v-alert-stub')
    expect(alert.attributes('type')).toBe(props.type)
  })
})
