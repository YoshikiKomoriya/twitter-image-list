import path from 'path'
import fs from 'fs'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // ソースディレクトリをROOT/src/配下に変更する
  srcDir: 'src/',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: `%s`,
    title: process.env.APP_TITLE,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    'nuxt-typed-vuex',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  /**
   * Axiosの設定
   * https://go.nuxtjs.dev/config-axios
   */
  axios: {},

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
    },
  },

  // サーバーミドルウェア（Expressサーバー）の設定
  serverMiddleware: ['~/functions'],

  // サーバーの設定
  server: {
    // ローカル開発環境のHTTPS化対応
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, 'cert/', 'localhost-key.pem'),
      ),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/', 'localhost.pem')),
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
