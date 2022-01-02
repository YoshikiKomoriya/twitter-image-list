import { env } from 'api/bin/dotenv'
import { authentication } from 'api/routes/bin/authentication'
import { createApplicationClient } from 'api/routes/bin/client'
import Boom from 'boom'
import { Request, Response, Router } from 'express'
import {
  CallbackRequest,
  ResponseAuthenticationLogout,
} from '~openapi/generated/src'

const router = Router()

// Twitterの認証画面へ遷移する
router.get('/', async (_request, response, next) => {
  // Twitter通信用のクライアントを生成する
  const client = createApplicationClient(
    env.get('CONSUMER_KEY'),
    env.get('CONSUMER_SECRET'),
    env.get('BEARER_TOKEN'),
  )

  // Twitterにリクエスト用トークン情報を発行するよう依頼する
  const callbackUrl = env.get('CALLBACK_URL')

  let requestToken
  try {
    requestToken = await authentication.getRequestToken(client, callbackUrl)
  } catch (error) {
    return next(error)
  }

  // リクエストトークンの情報を用いて、Twitterの認証画面へ遷移する
  const url = authentication.createAuthenticationUrl(requestToken.oauth_token)
  response.redirect(url)
})

// Twitterの認証画面から遷移した後の処理
router.get(
  '/callback',
  async (
    request: Request<any, any, any, CallbackRequest>,
    response: Response,
    next,
  ) => {
    // Twitter通信用のクライアントを生成する
    const client = createApplicationClient(
      env.get('CONSUMER_KEY'),
      env.get('CONSUMER_SECRET'),
      env.get('BEARER_TOKEN'),
    )

    // 認証情報を用いて、アクセストークンを取得する
    let accessToken
    try {
      accessToken = await authentication.getAccessToken(
        client,
        request.query.oauth_verifier,
        request.query.oauth_token,
      )
    } catch (error) {
      return next(error)
    }

    // セッション情報内にユーザー情報を格納して、いつでも利用できるようにする
    request.session.user = accessToken

    response.redirect('/home')
  },
)

// ログアウト処理
router.get(
  '/logout',
  (
    request: Request,
    response: Response<ResponseAuthenticationLogout>,
    next,
  ) => {
    // セッション情報を破棄する
    request.session.destroy((error) => {
      // エラーが発生している場合、エラー情報を送信する
      if (error) {
        return next(
          Boom.internal('セッション操作でエラーが発生しました', error),
        )
      }

      // セッションの破棄が正常に完了した場合、成功した旨を送信する
      response.json({
        result: 'success',
      })
      return next()
    })
  },
)

export { router }
