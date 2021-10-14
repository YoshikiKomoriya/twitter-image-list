import { shallowMount } from '~/test/util/mount'
import ButtonPrimary from '~/components/general/ButtonPrimary.vue'
import { buttonSize } from '~/preferences/buttonSize'

describe('プライマリー指定のボタン', () => {
  test('スロットを指定', () => {
    const slots = {
      icon: 'mdi-home',
      text: 'ボタンを押す',
    }
    const wrapper = shallowMount(ButtonPrimary, {
      slots,
    })

    const icon = wrapper.get('v-icon-stub')
    expect(icon.text()).toContain(slots.icon)

    const text = wrapper.find('v-btn-stub > span')
    expect(text.text()).toContain(slots.text)
  })

  test.each(Object.values(buttonSize))('ボタンサイズの指定（%p）', (size) => {
    const wrapper = shallowMount(ButtonPrimary, { propsData: { size } })

    // HTMLの属性名ではハイフンが省略されるため、置換処理を行う
    const attributeName = size.replace('-', '')

    const button = wrapper.get('v-btn-stub')
    const icon = wrapper.get('v-icon-stub')

    // サイズ指定がノーマルの場合、Vuetifyのコンポーネントにプロパティを指定しないため、HTMLの属性も追加されない
    if (size === buttonSize.normal) {
      expect(button.attributes(attributeName)).toBeUndefined()
      expect(icon.attributes(attributeName)).toBeUndefined()
      return
    }

    expect(button.attributes(attributeName)).toBe('true')
    expect(icon.attributes(attributeName)).toBe('true')
  })

  test.each([true, false])('ブロック全体へ広げるかどうかの指定', (block) => {
    const wrapper = shallowMount(ButtonPrimary, { propsData: { block } })

    const button = wrapper.get('v-btn-stub')

    // ブロック指定がfalseの場合、プロパティが**追加されない**ことを検証する必要がある
    if (block === false) {
      expect(button.attributes('block')).toBeUndefined()
      return
    }

    expect(button.attributes('block')).toBe(`${block}`)
  })
})
