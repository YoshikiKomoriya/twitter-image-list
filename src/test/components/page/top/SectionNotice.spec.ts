import SectionNotice from '~/components/page/top/SectionNotice.vue'
import { shallowMount } from '~/test/util/mount'

describe('トップページ内のアプリ説明ブロック', () => {
  test('h2タグの表示', () => {
    const wrapper = shallowMount(SectionNotice)

    const h2 = wrapper.get('h2')
    expect(h2.text()).toBe(`${process.env.APP_TITLE}について`)
  })

  test('スロットを指定', () => {
    const slots = {
      notice: 'スロット内に設定するテキスト',
    }
    const wrapper = shallowMount(SectionNotice, { slots })

    // 該当のテキストが設定されたカラムタグが存在するかどうか検証する
    const cols = wrapper.findAll('v-col-stub')
    const includedCols = cols.filter((col) => {
      return col.text() === slots.notice
    })

    expect(includedCols.length).toBeGreaterThan(0)
  })
})
