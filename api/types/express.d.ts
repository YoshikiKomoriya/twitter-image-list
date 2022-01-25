/**
 * ライブラリ'express'の定義ファイルを拡張したもの
 */
import Twitter from 'twitter-lite'

declare module 'express' {
  /**
   * リクエスト情報の拡張
   * 以下の情報を格納するようにしている
   * - Twitterとの通信用クライアントクラス
   */
  interface Request {
    client?: Twitter
  }
}
