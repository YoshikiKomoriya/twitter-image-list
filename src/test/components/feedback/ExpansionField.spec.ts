import ExpansionField from '~/components/feedback/ExpansionField.vue'
import { mount } from '~/test/util/mount'

describe('エラー詳細コンポーネント', () => {
  const slots = {
    button: 'エラー詳細ボタン',
    content: 'エラー詳細文言',
  }

  test('スロットを指定', async () => {
    // v-ifによる表示の変化を確認したいため、スタブ化を行わないmount()を使う
    const mountedWrapper = mount(ExpansionField, { slots })

    const button = mountedWrapper.find('.button')
    expect(button.text()).toContain(slots.button)

    // ボタンを押して、詳細ブロックを表示する
    await button.trigger('click')
    const content = mountedWrapper.find('.content')
    expect(content.text()).toContain(slots.content)
  })

  test('ボタンを押すと、詳細が記されたテキストエリアが展開する', async () => {
    // v-ifによる表示の変化を確認したいため、スタブ化を行わないmount()を使う
    const mountedWrapper = mount(ExpansionField, { slots })

    // 毎回必ず切り替わる（複数回切り替えても規定の動作を繰り返し続ける）ことを検証する
    const button = mountedWrapper.find('.button')
    for (let i = 0; i > 10; i++) {
      expect(mountedWrapper.find('.content').exists()).toBe(false)
      await button.trigger('click')
      expect(mountedWrapper.find('.content').text()).toContain(slots.content)
    }
  })
})
