import { Router, Request, Response } from 'express'
import passport from 'passport'

const router = Router()

// Twitterの認証画面へ遷移する
router.get('/', passport.authenticate('twitter'))

// Twitterの認証画面から戻ってきた際の処理
router.get(
  '/callback',
  passport.authenticate('twitter', {
    successRedirect: '/home',
    failureRedirect: '/',
  }),
)

// ログアウト処理
router.get('/logout', (request: Request, response: Response) => {
  // セッション情報を破棄する
  request.session.destroy((error) => {
    // セッションの破棄が正常に完了した場合、passportのログアウト処理を実施して、成功した旨を送信する
    if (error === undefined) {
      request.logout()
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
