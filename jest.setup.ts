/**
 * Jestの追加の設定
 */
import Vue from 'vue'
import Vuetify from 'vuetify'

/**
 * Vueの環境変数・開発者ツールに関する警告を抑制する
 * 主にjest.mock()やjest.spyOn()を使用している際に発生する警告を抑制する
 * @see https://stackoverflow.com/questions/61469650/vue-unit-testing-you-are-running-vue-in-development-mode
 */
Vue.config.productionTip = false
Vue.config.devtools = false

/**
 * Vuetifyの登録
 * Vueコンポーネントのテスト向けに、Vuetifyを登録する
 *
 * @note
 * コンポーネントのマウント時には別途'localVue'を利用しているが、グローバルなVueにもVuetifyを登録している
 * これを行わないと、TypsScriptに型の拡張が反映されず、実行時に'Unknown custom element: <v-*>'というエラーが発生するため
 * なお、マウント時にも[Vuetifyの登録（またはVuetifyのプロパティのモック化）が必要になる](https://github.com/vuejs/vue-test-utils/issues/1013#issuecomment-817338412)
 * （適用し忘れると、'TypeError: Cannot read property 'breakpoint' of undefined'等の'$vuetifyオブジェクトのプロパティが取得できない'旨のエラーが発生する）
 * これらの作業を初期設定として行う専用のヘルパー関数（<ROOT>/src/test/util/mount.ts）を用意しているため、テスト時にはそちらを利用すること
 */
Vue.use(Vuetify)
