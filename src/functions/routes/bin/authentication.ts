/**
 * Twitterの認証情報を検証するミドルウェア
 */
import { Request, Response, NextFunction } from 'express'
import Boom from 'boom'

/**
 * Twitterの認証が済んでいるか検証する
 */
const isAuthenticated = (request: Request) => {
  // セッション情報内の認証情報を検証する
  const pair = request.session.accessTokenPair

  // 連携が済んでいる（認証情報が存在する）場合、認証が済んでいる
  return pair !== undefined
}

/**
 * Twitterの認証が済んでいるかどうか検証する
 * 認証が済んでいない場合、エラー情報を出力する
 */
const verifyAuthentication = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  // 認証が済んでいるか検証する
  const authenticated = isAuthenticated(request)

  // 認証が済んでいる場合、何もせず次の処理へ
  if (authenticated) {
    return next()
  }

  // 認証が済んでいない場合、未認証orセッション切れが想定される。その旨のエラーを返却する
  next(Boom.forbidden('not authenticated'))
}

export { verifyAuthentication }
