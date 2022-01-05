/**
 * ライブラリ'express-session'の定義ファイルを拡張したもの
 */
import { AccessTokenResponse } from 'twitter-lite'

declare module 'express-session' {
  /**
   * セッション情報の拡張
   * 以下の情報を格納するようにしている
   * - Twitterの認証によって得られたユーザー情報
   */
  interface Session {
    user?: AccessTokenResponse
  }
}
