/**
 * TwitterとAPI通信を行うクライアントクラスを生成するミドルウェア
 */
import Boom from 'boom'
import { Request, Response, NextFunction } from 'express'
import { env } from '~/bin/dotenv'
import { createApplicationClient, createUserClient } from '~/routes/bin/client'

/**
 * TwitterとのAPI通信を行うアプリケーション向けクライアントクラスを生成して、リクエスト情報に付与する
 * @param request リクエスト情報
 * @param _response レスポンス情報
 * @param next Express上で次の処理へ移るための関数
 * @returns リクエスト情報にクライアントクラスを付与して次の処理へ移行する。未認証の場合はエラーオブジェクトを渡して次の処理へ移行する
 */
const addApplicationClient = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  // クライアントクラスを生成して、リクエスト情報に付与する
  request.client = createApplicationClient(
    env.get('CONSUMER_KEY'),
    env.get('CONSUMER_SECRET'),
    env.get('BEARER_TOKEN'),
  )

  return next()
}

/**
 * TwitterとのAPI通信を行うユーザー向けクライアントクラスを生成して、リクエスト情報に付与する
 * @param request リクエスト情報
 * @param _response レスポンス情報
 * @param next Express上で次の処理へ移るための関数
 * @returns リクエスト情報にクライアントクラスを付与して次の処理へ移行する。未認証の場合はエラーオブジェクトを渡して次の処理へ移行する
 */
const addUserClient = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  // セッション情報内からユーザー情報を取得する
  const user = request.session.user

  // ユーザー情報が存在しない場合、認証が済んでいないためエラーとする
  if (user === undefined) {
    return next(Boom.forbidden('not authenticated'))
  }

  // クライアントクラスを生成して、リクエスト情報に付与する
  request.client = createUserClient(
    env.get('CONSUMER_KEY'),
    env.get('CONSUMER_SECRET'),
    user.oauth_token,
    user.oauth_token_secret,
  )

  return next()
}

export { addApplicationClient, addUserClient }
