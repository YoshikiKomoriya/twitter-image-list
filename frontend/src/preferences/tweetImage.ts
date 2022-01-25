/**
 * ツイートに含まれる画像に関する設定
 */

/**
 * ツイートの各種サイズの画像を取得するためのクエリパラメータ
 * Twitterの画像URLに該当パラメータを付与すると、各種サイズの画像を取得できる
 */
const parameter = {
  small: {
    name: 'small',
  },
  original: {
    name: 'orig',
  },
} as const

export { parameter }
