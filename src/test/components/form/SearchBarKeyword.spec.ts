import { Wrapper } from '@vue/test-utils'
import SearchBarKeyword from '~/components/form/SearchBarKeyword.vue'
import { encodeQuery } from '~/modules/query'
import {
  errorMessage,
  icon,
  limit,
  pathPrefixes,
  rules,
} from '~/preferences/searchBar'
import { getRandomIntInclusive } from '~/test/util/math'
import { mount, shallowMount } from '~/test/util/mount'

describe('キーワード検索用の検索バー', () => {
  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = shallowMount(SearchBarKeyword)
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
      const componentForProps = shallowMount(SearchBarKeyword, {
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
        'a'.repeat(getRandomIntInclusive(limit.keyword.min, limit.keyword.max)),
      ),
    ])('文字数のカウント（正常時）', (result) => {
      expect(result).toBe(true)
    })

    test('文字数のカウント（異常時・0文字）', () => {
      const result = rules.keyword.counter('')
      expect(result).toBe(errorMessage.keyword.min)
    })

    test('文字数のカウント（異常時・101文字以上）', () => {
      const result = rules.keyword.counter('a'.repeat(limit.keyword.max + 1))
      expect(result).toBe(errorMessage.keyword.max)
    })
  })

  describe('キーワード送信時', () => {
    test.each([
      '検索用キーワード',
      'キ ー ワ ー ド', // 空白スペースが存在する場合
      'test filter:image', // 検索オプションが指定されている場合
      '%E3%83%86%E3%82%B9%E3%83%88', // 'テスト'をパーセントエンコードしたもの
    ])('送信時、検索結果のページへリダイレクトする', async (keyword) => {
      // イベントの発火を確認したいため、スタブ化を行わないmount()を使う
      const mountedWrapper = mount(SearchBarKeyword)
      await mountedWrapper.setData({ keyword })

      const button = mountedWrapper.find(
        'button[aria-label="append icon"].mdi-magnify',
      )
      await button.trigger('click')

      const encodedKeyword = encodeQuery(keyword)
      expect(mountedWrapper.vm.$route.path).toBe(
        `/${pathPrefixes.keyword}/${encodedKeyword}`,
      )
    })

    test.each([
      '検索用キーワード',
      'キ ー ワ ー ド', // 空白スペースが存在する場合
      'test filter:image', // 検索オプションが指定されている場合
      '%E3%83%86%E3%82%B9%E3%83%88', // 'テスト'をパーセントエンコードしたもの
    ])('送信用の関数のテスト（%s）', async (keyword) => {
      await wrapper.setData({ keyword })

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
      type SearchBarKeywordType = typeof SearchBarKeyword
      interface ExtendedComponent extends SearchBarKeywordType {
        submit: Function
      }
      const vm = wrapper.vm as unknown as ExtendedComponent
      vm.submit()

      const encodedKeyword = encodeQuery(keyword)
      expect(wrapper.vm.$route.path).toBe(
        `/${pathPrefixes.keyword}/${encodedKeyword}`,
      )
    })
  })
})
