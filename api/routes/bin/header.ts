/**
 * キャッシュ設定
 */

import { Response } from 'express'

/**
 * レスポンスのヘッダーにキャッシュ動作の設定を追加する
 * 複数のサーバーで共有できるように設定する
 * @param response レスポンス情報
 * @param maxAge キャッシュの有効期限（秒数）
 */
const setCacheControlForPublic = (response: Response, maxAge = 30) => {
  const age = Math.round(maxAge) // 引数が整数以外の値で渡ってくる可能性があるため、整数になるよう調整する
  response.set('Cache-Control', `public, max-age=${age}`)
}

export { setCacheControlForPublic }
