import fs from 'fs'
import path from 'path'
import { NuxtConfig } from '@nuxt/types'
import { FirebaseConfiguration } from '@nuxtjs/firebase'
import consola from 'consola'
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

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '~/plugins/router.ts', mode: 'client' }],

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
    // https://firebase.nuxtjs.org
    '@nuxtjs/firebase',
  ],

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

  firebase: {
    config: getFirebaseConfig(),
    services: {
      functions: true,
      analytics: {
        collectionEnabled: process.env.NODE_ENV === 'production',
      },
    },
    onFirebaseHosting: true,
  },

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

/**
 * 環境変数からFirebaseの設定を取得する
 */
function getFirebaseConfig() {
  /**
   * 独自処理のアサーションで利用される型
   * アサーションでは明示的に型を宣言する必要があるため、予め定義している
   *
   * @note 型を宣言していなかった場合に出てくるエラー
   * > アサーションでは、呼び出し先のすべての名前が明示的な型の注釈で宣言されている必要があります。ts(2775)
   * > assert.ts(28, 7): 'assertIsString' には、明示的な型の注釈が必要です。
   */
  type assertGenericsType<T> = (value: any) => asserts value is T

  /**
   * ジェネリクスを利用したアサーション処理
   * @param value 検証対象となる値
   * @param validator 検証処理
   * @throws {@link TypeError} 検証の結果、適切でない値と判断された場合
   * @see https://github.com/microsoft/TypeScript/issues/41047#issuecomment-706761663 参考にしたコード
   */
  const assertGenerics: <T>(
    value: any,
    validator: (value: any) => boolean,
  ) => asserts value is T = (value, validator) => {
    if (validator(value) === false) {
      consola.error('環境変数が設定されていません')
      process.exit(1)
    }
  }

  /**
   * 文字列であることを検証する
   * @param value 検証したい値
   */
  const assertIsString: assertGenericsType<String> = (value: any) =>
    assertGenerics<String>(value, (value) => typeof value === 'string')

  // 環境変数が定義されていることを確認する
  assertIsString(process.env.API_KEY)
  assertIsString(process.env.AUTH_DOMAIN)
  assertIsString(process.env.PROJECT_ID)
  assertIsString(process.env.STORAGE_BUCKET)
  assertIsString(process.env.MESSAGING_SENDER_ID)
  assertIsString(process.env.APP_ID)
  assertIsString(process.env.MEASUREMENT_ID)

  // Firebaseの設定を組み立てる
  const config: FirebaseConfiguration = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
  }

  return config
}

export default config
