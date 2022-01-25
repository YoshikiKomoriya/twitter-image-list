/**
 * Expressサーバーの設定を行う
 * @see https://expressjs.com/ja/advanced/best-practice-security.html
 */

import path from 'path'

// サーバー系ライブラリの読み込み
import express from 'express'

// 各種設定の読み込み
import './bin/moduleAlias'
import * as OpenApiValidator from 'express-openapi-validator'
import helmet from 'helmet'
import { env } from '~/bin/dotenv'
import { errorHandler } from '~/bin/errorHandler'
import { router } from '~/routes'

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

// リクエストのバリデーション設定
const schema = path.resolve(__dirname, '../openapi/schema.yml')
app.use(OpenApiValidator.middleware({ apiSpec: schema }))

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
