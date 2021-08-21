/**
 * TwitterとのAPI通信用クライアントクラスを生成するミドルウェア
 */
import { Request, Response, NextFunction } from 'express'
import Twitter from 'twitter-lite'
import Boom from 'boom'
import { env } from '~/functions/bin/dotenv'

/**
 * 通信用クライアントクラスを生成して、セッション情報に格納する
 */
const createClient = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  // セッション情報内に通信用クライアントクラスが既に存在する場合、何もせず次の処理へ
  if (request.session.client !== undefined) {
    return next()
  }

  // セッション情報内の認証情報を取得する
  const pair = request.session.accessTokenPair

  // 認証情報が取得できなかった場合、その旨のエラーを返却する
  if (pair === undefined) {
    return next(Boom.forbidden('not loading authentication'))
  }

  // 通信用のクライアントクラスを生成して、セッション情報に格納する
  const client = new Twitter({
    consumer_key: env.get('CONSUMER_KEY'),
    consumer_secret: env.get('CONSUMER_SECRET'),
    access_token_key: pair.accessToken,
    access_token_secret: pair.accessTokenSecret,
  })
  request.session.client = client

  return next()
}

export { createClient }
