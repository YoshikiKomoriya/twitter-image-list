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

export { addApplicationClient }
