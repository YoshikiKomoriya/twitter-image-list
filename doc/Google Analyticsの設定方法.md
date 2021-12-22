# Google Analytics の設定方法

## 結論

- 採用したのは[@nuxtjs/firebase](https://firebase.nuxtjs.org)ライブラリを導入して、Firebase アプリケーションに Google Analytics の統合を行う方法
  - インフラに Firebase を選択しているため、その機能群を中心に実装することで、管理の手間を減らす方針

## 設定方法

設置方法に合わせて複数の専用モジュールが用意されている
Nuxt 公式コミュニティにて、ドキュメントの制定が進められている（※）

※ [[RFC] Support Global Site Tag (gtag.js) and Google Analytics #82](https://github.com/nuxt-community/gtm-module/issues/82)

### Firebase アプリケーションに Google Analytics を統合する

- [@nuxtjs/firebase](https://firebase.nuxtjs.org)ライブラリの導入

### Google Tag Manager（gtm）のタグを設置する

- [@nuxtjs/gtm](https://www.npmjs.com/package/@nuxtjs/gtm)ライブラリの導入
  - [@nuxtjs/google-tag-manager](https://www.npmjs.com/package/@nuxtjs/google-tag-manager)は**非推奨**なので使用しない

### Global Site Tag（gtag.js）のタグを設置する

- [@nuxtjs/google-gtag](https://www.npmjs.com/package/@nuxtjs/google-gtag)ライブラリの導入
  - リポジトリのリンクが切れてる…これみたい ↓
    - [nuxt-community/google-gtag-module: Enable google gtagjs for NuxtJs](https://github.com/nuxt-community/google-gtag-module)

### Google Analytics（analytics.js）のタグを設置する

- [@nuxtjs/google-analytics](https://google-analytics.nuxtjs.org/)ライブラリの導入
  - `gtag.js`の方が新しい仕様であるため、新規で選ぶ必要はないと思う
