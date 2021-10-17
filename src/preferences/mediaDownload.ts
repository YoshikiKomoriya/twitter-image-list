/**
 * メディアのダウンロードに関する設定
 */

/**
 * 処理の実行間隔に関する設定値
 */
const processInterval = {
  count: 15,
  sleep: 5000,
}

/**
 * オリジナル画像を取得するためのURL向けパラメータ
 * Twitterの画像URLに該当パラメータを付与すると、オリジナル画像を取得できる
 */
const originalImageUrlParameter = {
  name: 'orig',
}

export { processInterval, originalImageUrlParameter }
