/**
 * ライブラリ'supertest'のインスタンス生成処理をモジュール化したもの
 */
import { session } from 'api/bin/session'
import app from 'api/index'
import express from 'express'
import supertest from 'supertest'

const request = supertest(app.handler)

// テスト向けに、認証情報が設定されたリクエスト方法を設定する
/**
 * supertest や superagent の拡張を試みたが、調べた限りではいい感じに動作するものが見つからなかった…
 * そのため、Expressアプリのコピーを作る力技で実装している
 * 以下の方法を試みた
 * - ライブラリ[supertest-session](https://github.com/rjz/supertest-session)
 *     - セッションに追加した情報を取得する方法がわからず…CookiejarのCookieAccessInfoに関しては取得できた
 * - [レスポンスのヘッダーにある'set-cookie'を参照して永続化する方法](https://gist.github.com/joaoneto/5152248)
 *     - ヘッダーに'set-cookie'自体が存在してない様子
 * @see https://stackoverflow.com/questions/20213674/nodejs-supertest-access-to-session-object#28217957
 */
const mockApp = express()
mockApp.use(session())
mockApp.all('*', (request, _response, next) => {
  request.session.user = {
    oauth_token: 'test_oauth_token',
    oauth_token_secret: 'test_oauth_token_secret',
    user_id: 'test_user_id',
    screen_name: 'test_screen_name',
  }
  next()
})
mockApp.use(app.handler)

const authenticatedRequest = supertest(mockApp)

export { request, authenticatedRequest }
