/**
 * ライブラリ'jest-express'の定義ファイルを拡張したもの
 */
import { Express } from 'jest-express/lib/express'

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
}
