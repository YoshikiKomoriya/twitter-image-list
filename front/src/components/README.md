# components

## ディレクトリの構成

利用目的別にディレクトリを分けている

| 分類名     | コンポーネント                                                                                                                                                  | 目的                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| General    | Button, Icon, Typography                                                                                                                                        | 全般的に使うもの                                                 |
| Navigation | Affix, Breadcrumb, Dropdown, Menu, Pagination, PageHeader, Steps                                                                                                | ナビゲーションに使う                                             |
| Form       | AutoComplete, Checkbox, Cascader, DatePicker, Form, InputNumber, Input, Mentions, Rate, Radio, Switch, Slider, Select, TreeSelect, Transfer, TimePicker, Upload | データ入力に使う（フォーム）                                     |
| Display    | Avatar, Badge, Comment, Collapse, Carousel, Card, Calendar, Descriptions, Empty, Image, List, Popover, Statistic, TreeTooltip, Timeline, Tag, Tabs, Table       | データ表示に使う                                                 |
| Feedback   | Alert, Drawer, Modal, Message, Notification, Progress, Popconfirm, Result, Spin, Skeleton                                                                       | ユーザーへのフィードバックに使う                                 |
| Page       |                                                                                                                                                                 | 特定のページでのみ使うもの。ページごとに子ディレクトリを作成する |

参考 : [Atomic design を辞めて利用目的別のディレクトリ構成に移行する](https://zenn.dev/ynakamura/articles/8fab06bba527b5)

## コーディングルール

なるべく[Vue.js のスタイルガイド](https://vuejs.org/v2/style-guide/)に沿った形にする
命名以外は Linter がよしなに整えてくれるはず…

### よく悩むルール

- ファイル名は PascalCase で統一する
  - [Single-file component filename casing](https://vuejs.org/v2/style-guide/#Single-file-component-filename-casing-strongly-recommended)
  - TypeScript で利用する場合は、PascalCase でインポート・登録を行う（ファイル名と統一する）
    ```TypeScript
    import MyComponent from '~/components/MyComponent.vue'
    ```
    ```TypeScript
    export default Vue.extend({
      components: { MyComponent },
    }
    ```
  - HTML で利用する場合は kebab-case で利用する
    ```html
    <my-component></my-component>
    ```
    - PascalCase でコンポーネントを登録していても、kebab-case で利用できる
- ファイル名は一般的な単語 → 説明的な単語の順番で命名する
  - [Order of words in component names](https://vuejs.org/v2/style-guide/#Order-of-words-in-component-names-strongly-recommended)
  - [Base component names](https://vuejs.org/v2/style-guide/#Base-component-names-strongly-recommended)
  - プレフィックスの単語から順にグループ分けするイメージ
  - 以下、スタイルガイドから引用
  ```shell
  components/
  |- SearchButtonClear.vue
  |- SearchButtonRun.vue
  |- SearchInputQuery.vue
  |- SearchInputExcludeGlob.vue
  |- SettingsCheckboxTerms.vue
  |- SettingsCheckboxLaunchOnStartup.vue
  ```
- ファイル名に使う単語は省略しない
  - [Full-word component names](https://vuejs.org/v2/style-guide/#Order-of-words-in-component-names-strongly-recommended)
  - [Tightly coupled component names](https://vuejs.org/v2/style-guide/#Order-of-words-in-component-names-strongly-recommended)
  - 名で体を表すことを優先しているみたい
    - 入力の煩わしさはエディタの補完機能で軽減させる方針らしい
  - ディレクトリを分割してグループ分けをすることもなるべく避ける
    - あまり徹底しすぎるとそれはそれで見づらいため、検討した上でやるのは OK
  - `UProfOpts.vue`→`UserProfileOptions.vue`（スタイルガイドから引用）
