import { Router, Request, Response } from 'express'
import Boom from 'boom'
import { createApplicationClient } from '~/routes/bin/client'
import { authentication } from '~/routes/bin/authentication'
import { env } from '~/bin/dotenv'

const router = Router()

// Twitterの認証画面へ遷移する
router.get('/', async (_request, response, next) => {
  // Twitter通信用のクライアントを生成する
  const client = createApplicationClient(
    env.get('CONSUMER_KEY'),
    env.get('CONSUMER_SECRET'),
  )

  // Twitterにリクエスト用トークン情報を発行するよう依頼する
  const callbackUrl = env.get('CALLBACK_URL')
  const requestToken = await authentication
    .getRequestToken(client, callbackUrl)
    .catch((error) => {
      next(error)
      throw error
    })

  // リクエストトークンの情報を用いて、Twitterの認証画面へ遷移する
  const url = authentication.createAuthenticationUrl(requestToken.oauth_token)
  response.redirect(url)
})

// Twitterの認証画面から遷移した後の処理
router.get('/callback', async (request: Request, response: Response, next) => {
  // Twitter通信用のクライアントを生成する
  const client = createApplicationClient(
    env.get('CONSUMER_KEY'),
    env.get('CONSUMER_SECRET'),
  )

  // レスポンスに含まれる認証情報を解析する
  const query = request.query
  const oauthVerifier = query.oauth_verifier
  const oauthToken = query.oauth_token

  // クエリに文字列以外の情報が渡ってきている場合、形式が不正またはパースエラーの可能性がある
  if (typeof oauthVerifier !== 'string' || typeof oauthToken !== 'string') {
    return next(Boom.badRequest('OAuth token is not parsed'))
  }

  // 認証情報を用いて、アクセストークンを取得する
  const accessToken = await authentication
    .getAccessToken(client, oauthVerifier, oauthToken)
    .catch((error) => {
      next(Boom.badRequest(error))
      throw error
    })

  // セッション情報内にユーザー情報を格納して、いつでも利用できるようにする
  request.session.user = accessToken

  response.redirect('/home')
})

// ログアウト処理
router.get('/logout', (request: Request, response: Response, next) => {
  // セッション情報を破棄する
  request.session.destroy((error) => {
    // エラーが発生している場合、エラー情報を送信する
    if (error) {
      return next(Boom.internal(error))
    }

    // セッションの破棄が正常に完了した場合、成功した旨を送信する
    response.json({
      result: 'success',
    })
    return next()
  })
})

export { router }
