/**
 * Expressサーバーの設定を行う
 * @see https://expressjs.com/ja/advanced/best-practice-security.html
 */

// サーバー系ライブラリの読み込み
import express, { Express } from 'express'

// 各種設定の読み込み
import './bin/moduleAlias'
import helmet from 'helmet'
import passport from 'passport'
import { errorHandler } from '~/functions/bin/errorHandler'
import { env } from '~/functions/bin/dotenv'
import { session } from '~/functions/bin/session'
import { strategy } from '~/functions/bin/passportTwitter'
import { router } from '~/functions/routes'

// 環境変数の読み込み
env.config()

// Expressの設定
const app = express()

// helmetの設定（セキュリティ対策として特定のHTTPヘッダを設定する）
app.use(helmet())

// データの受け取りに関する設定
// データを解析して、適切な型のオブジェクトとして受け取る
app.use(express.urlencoded({ extended: true }))
// JSON文字列が渡ってきた場合に、JSONオブジェクトに変換する
app.use(express.json())

// セッションの設定
app.use(session())

// passportの設定
app.use(passport.initialize())
app.use(passport.session())
passport.use(strategy)

// 認証成功後にユーザー情報をセッションに格納する
passport.serializeUser((user, done) => {
  done(null, user)
})

// リクエスト時、セッション内のユーザー情報をリクエスト情報に加える
passport.deserializeUser(
  (user: false | Express.User | null | undefined, done) => {
    done(null, user)
  },
)

// ルーティングの設定
app.use(router)

// HTTPリクエストのエラーハンドリングに関する設定
/**
 * ユーザー定義でエラーハンドリングを行う場合、アプリケーションの設定の最後に定義する必要がある
 * > エラー処理ミドルウェアは、その他の app.use() およびルート呼び出しの後で最後に定義します。
 * @see http://expressjs.com/ja/guide/error-handling.html
 */
app.use(errorHandler)

export default {
  path: '/server',
  handler: app,
}
