# components

## ディレクトリの構成

- 基本 : `<ROOT>/src/`配下のディレクトリ構造と対応する
- util : テスト向けのモジュールを格納している

## 注意事項

- 各ライブラリの責務までテスト範囲としないように注意する

  - ライブラリの開発者によってテストが行われているため、そちらを信頼する
  - （線引きが難しいものもあるが）以下のようなテストは行わない方針
    - Vuetify によって提供されている機能
      - `v-img`の**画像の表示**は確認せず、**画像パスが正確に指定されているかどうか**のみテストする

- Vuetify のコンポーネントは`<v-*-stub>`となる

  - `<v-img-stub>` `<v-card-stub>` 等
  - `wrapper.find()`等でタグ名を指定する際に、`stub`を入れ忘れないように注意する

- `<nuxt-link>`は`RouterLinkStub`となる
  - `vue-router`向けのモック化機能
  - 単純な`<a>`タグに置き換えられるが、`wrapper.findComponent(RouterLinkStub)`で要素を取得すると、設定されていた属性等を参照することができる
  - Veutify の`to` `nuxt` 属性を指定したリンクは`<v-*-stub>`のタグで扱う事になる（`RouterLinkStub`ではない）ため、注意すること

## Vue ファイルのマウント方法

### 基本的な利用方法

```TypeScript
import { shallowMount } from '~/test/util/mount'
import HogeComponent from '~/components/HogeComponent.vue'

  let wrapper: Wrapper<Vue>

  beforeEach(() => {
    wrapper = shallowMount(Header)
  })

describe('コンポーネント名等、コンポーネントの代表的な情報', () => {
  test('テスト名、具体的な情報', () => {
    const wrapper = shallowMount(HogeComponent)

    expect(wrapper.exists()).toBe(true)
  })
})
```

### 詳細

- `/util/mount`に存在する`mount()`または`shallowMount()`を利用する

  - マウント作業のコード量が多少あるため、ヘルパー関数を定義している
  - PC 表示・モバイル表示といった Vuetify のプロパティを指定する必要がある場合は、インスタンスを生成して関数の引数に指定する

  ```TypeScript
  import { shallowMount } from '~/test/util/mount'
  import HogeComponent from '~/components/HogeComponent.vue'

    let wrapper: Wrapper<Vue>

    beforeEach(() => {
      // モバイル表示を確認したいため、ブレークポイントの指定を行う
      const vuetify = new Vuetify({
        breakpoint: {
          mobileBreakpoint: 'lg', // PC表示時は0（数値）を指定する
        },
      })
      wrapper = shallowMount(Header, { vuetify })
    })

  describe('コンポーネント名等、コンポーネントの代表的な情報', () => {
    test('テスト名、具体的な情報', () => {
      const wrapper = shallowMount(HogeComponent)

      expect(wrapper.exists()).toBe(true)
    })
  })
  ```

- 基本的に`shallowMount()`を利用する

  - 子コンポーネントがスタブとしてマウントされる
  - 子コンポーネントとの依存性を排除して、単体でテストを行いたいため
