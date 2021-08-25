import { Router, Request, Response } from 'express'
import Boom from 'boom'
import {
  createApplicationClient,
  createUserClient,
} from '~/functions/routes/bin/client'
import { authentication } from '~/functions/routes/bin/authentication'
import { env } from '~/functions//bin/dotenv'

const router = Router()

// Twitterの認証画面へ遷移する
router.get('/', async (_request: Request, response: Response) => {
  // Twitter通信用のクライアントを生成する
  const client = createApplicationClient(
    env.get('CONSUMER_KEY'),
    env.get('CONSUMER_SECRET'),
  )

  // Twitterにリクエスト用トークン情報を発行するよう依頼する
  const callbackUrl = env.get('CALLBACK_URL')
  const requestToken = await authentication
    .requestToken(client, callbackUrl)
    .catch((error) => {
      throw error
    })

  // リクエストトークンの情報を用いて、Twitterの認証画面へ遷移する
  const url = authentication.createAuthenticationUrl(requestToken.oauth_token)
  response.redirect(url)
})

// Twitterの認証画面から遷移した後の処理
router.get('/callback', async (request: Request, response: Response) => {
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
    throw Boom.badRequest('OAuth token is not parsed')
  }

  // 認証情報を用いて、アクセストークンを取得する
  const accessToken = await authentication
    .getAccessToken(client, oauthVerifier, oauthToken)
    .catch((error) => {
      throw error
    })

  // セッション情報内にユーザー用クライアントクラスを格納して、いつでも利用できるようにする
  const userClient = createUserClient(
    env.get('CONSUMER_KEY'),
    env.get('CONSUMER_SECRET'),
    accessToken.oauth_token,
    accessToken.oauth_token_secret,
  )
  request.session.client = userClient

  response.redirect('/home')
})

// ログアウト処理
router.get('/logout', (request: Request, response: Response) => {
  // セッション情報を破棄する
  request.session.destroy((error) => {
    // セッションの破棄が正常に完了した場合、passportのログアウト処理を実施して、成功した旨を送信する
    if (error === undefined) {
      response.json({
        result: 'success',
      })
      return
    }

    // エラーが発生している場合、エラー情報を送信する
    response.json({
      result: 'failed',
      error,
    })
  })
})

export { router }
