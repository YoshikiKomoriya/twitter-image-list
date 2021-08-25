/**
 * ライブラリ'express-session'の定義ファイルを拡張したもの
 */
import Twitter from 'twitter-lite'

declare module 'express-session' {
  /**
   * 認証情報を格納するオブジェクト
   */
  interface AccessTokenPair {
    accessToken: string
    accessTokenSecret: string
  }

  /**
   * リクエスト情報の拡張
   * 以下の情報を格納するようにしている
   * - 認証情報
   * - Twitterとの通信用クライアントクラス
   */
  interface Session {
    accessTokenPair?: AccessTokenPair
    client?: Twitter
  }
}
