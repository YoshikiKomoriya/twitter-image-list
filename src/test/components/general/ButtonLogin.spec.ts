import ButtonLogin from '~/components/general/ButtonLogin.vue'
import { buttonSize } from '~/preferences/buttonSize'
import { shallowMount } from '~/test/util/mount'

describe('ログインボタン', () => {
  test('スロットに指定した文字列', () => {
    const wrapper = shallowMount(ButtonLogin)

    expect(wrapper.text()).toContain('mdi-twitter')
    expect(wrapper.text()).toContain('Twitterでログイン')
  })

  test.each(Object.values(buttonSize))('ボタンサイズの指定（%p）', (size) => {
    const wrapper = shallowMount(ButtonLogin, { propsData: { size } })

    expect(wrapper.attributes('size')).toBe(size)
  })

  test.each([true, false])('ブロック全体へ広げるかどうかの指定', (block) => {
    const wrapper = shallowMount(ButtonLogin, { propsData: { block } })

    // ブロック指定がfalseの場合、プロパティが**追加されない**ことを検証する必要がある
    if (block === false) {
      expect(wrapper.attributes('block')).toBeUndefined()
      return
    }

    expect(wrapper.attributes('block')).toBe(`${block}`)
  })
})
