import fs from 'fs'
import path from 'path'
import { NuxtConfig } from '@nuxt/types'
import colors from 'vuetify/es5/util/colors'

const config: NuxtConfig = {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',

  // ソースディレクトリをROOT/src/配下に変更する
  srcDir: 'src/',

  // エイリアスの設定
  alias: {
    '~openapi': path.resolve(__dirname, '/openapi'),
    '@openapi': path.resolve(__dirname, '/openapi'),
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: `%s | TWISTTER（ツイスター） | Twitter画像検索&ダウンロード`,
    title: process.env.APP_TITLE,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // フロントエンドに公開される環境変数
  publicRuntimeConfig: {
    appTitle: process.env.APP_TITLE,
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
  content: {
    liveEdit: false,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    theme: {
      dark: false,
      default: false,
      disable: false,
      options: {},
      themes: {
        light: {
          primary: '#00bcd4',
          secondary: '#00a0d4',
          accent: '#d45100',
          gray: '#ebeeef',
          info: colors.teal.base,
          warning: colors.amber.base,
          error: colors.deepOrange.base,
          success: colors.green.base,
        },
        dark: {
          primary: '#00262a',
          secondary: '#00ACC1',
          accent: '#FFA726',
          gray: '#70878f',
          info: colors.teal.base,
          warning: colors.amber.base,
          error: colors.deepOrange.base,
          success: colors.green.base,
        },
      },
    },
  },

  // サーバーミドルウェア（Expressサーバー）の設定
  serverMiddleware: ['../functions'],

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
  build: {
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        /**
         * デバッグ環境向けにソースマップを設定する
         * @see https://webpack.js.org/configuration/devtool/
         */
        config.devtool = 'eval-source-map'
      }
    },
  },
}

export default config
