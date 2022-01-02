/**
 * セッションに関する設定
 * express-seessionのヘルパー
 */

import { env } from 'api/bin/dotenv'
import expressSession from 'express-session'

/**
 * express-sessionの初期化処理に関するヘルパー関数
 * 環境変数から規定値を読み込んで、セッションの設定を行う
 * @returns セッションの初期設定を行う関数を実行する
 */
export const session = () => {
  const maxAge = parseInt(env.get('SESSION_COOKIE_MAX_AGE_BY_HOUR'))

  const options: expressSession.SessionOptions = {
    // セッションIDの暗号化キー
    secret: env.get('SECRET_KEY'),
    // セッションアクセス時、変更がない場合でも上書きするかどうか
    resave: false,
    // 未初期化状態のセッションを保存するかどうか
    saveUninitialized: true,
    // レスポンス時にクッキーの有効期限のカウントをリセットするかどうか
    rolling: true,
    // クッキーの設定
    cookie: {
      domain: env.get('APP_HOST'),
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * maxAge, // 単位はミリ秒。環境変数によって○時間となるように設定している
    },
  }

  return expressSession(options)
}
