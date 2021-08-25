/**
 * ライブラリ'jest-express'の定義ファイルを拡張したもの
 */
import { Express } from 'jest-express/lib/express'
import Twitter from 'twitter-lite'

declare module 'jest-express/lib/request' {
  /**
   * リクエスト情報に関するオブジェクト
   * Requestクラス内で定義されているものだが、exportされていないためimportして利用することができない
   * Requestクラスの拡張の際に必要となるため、こちらに定義の記載をコピーしている
   */
  interface IRequestOptions {
    method?:
      | 'GET'
      | 'POST'
      | 'DELETE'
      | 'PATCH'
      | 'PUT'
      | 'HEAD'
      | 'OPTIONS'
      | 'CONNECT'
    headers?: any
    app?: Express
  }

  /**
   * リクエスト情報内に格納するセッション情報
   * express-sessionのSessionクラスをそのまま利用するのが望ましいが、以下の事由に対応するのに時間がかかりそうなため、暫定的に独自に定義している
   * - コンストラクタがプライベートメソッドとして定義されているため、外部からインスタンスを生成できない
   */
  interface Session {
    client?: Twitter
  }

  interface IRequest {
    session: Session
  }
}
