import { Wrapper } from '@vue/test-utils'
import { shallowMount } from '~/test/util/mount'
import SearchKeyword from '~/components/form/SearchKeyword.vue'
import { icon, rules } from '~/models/searchBar'
import { getRandomIntInclusive } from '~/test/util/math'

describe('キーワード検索用の検索バー', () => {
  let wrapper: Wrapper<Vue>

  // プロパティにアクセスしようとすると、入れ子が深く見通しが悪くなるため、変数に入れて省略する
  const limit = rules.keyword.limit

  beforeEach(() => {
    wrapper = shallowMount(SearchKeyword)
  })

  describe('コンポーネントの設定', () => {
    test('検索バーの表示', () => {
      const textField = wrapper.get('v-text-field-stub')
      expect(textField.exists()).toBe(true)
    })

    test('キーワードの指定', async () => {
      const keywords = {
        props: '検索キーワードのテスト（propsで指定）',
        data: '検索キーワードのテスト（dataで指定）',
      }

      // propsで指定した場合（最初から表示されている状態）
      const componentForProps = shallowMount(SearchKeyword, {
        propsData: {
          value: keywords.props,
        },
      })
      expect(componentForProps.attributes('value')).toBe(keywords.props)

      // dataで指定した場合（検索バーに入力した状態）
      await wrapper.setData({ keyword: keywords.data })
      expect(wrapper.attributes('value')).toBe(keywords.data)
    })

    test('ラベルの指定', () => {
      const label = wrapper.attributes('label')
      expect(label).toBe('検索キーワード')
    })

    test('アイコンの指定', () => {
      const appendoutericon = wrapper.attributes('appendoutericon')
      expect(appendoutericon).toBe(icon)
    })
  })

  describe('キーワードの入力条件', () => {
    test.each([
      rules.keyword.counter(undefined), // 未入力
      rules.keyword.counter(
        'a'.repeat(getRandomIntInclusive(limit.min, limit.max)),
      ),
    ])('文字数のカウント（正常時）', (result) => {
      expect(result).toBe(true)
    })

    test('文字数のカウント（異常時・0文字）', () => {
      const result = rules.keyword.counter('')
      expect(result).toBe('キーワードを入力してください')
    })

    test('文字数のカウント（異常時・101文字以上）', () => {
      const result = rules.keyword.counter('a'.repeat(limit.max + 1))
      expect(result).toBe('キーワードが長すぎます')
    })
  })
})
