/**
 * ライブラリ'jest-express'のファイルを拡張したもの
 */
import { Request, IRequestOptions } from 'jest-express/lib/request'

/**
 * リクエスト情報の拡張
 * 以下の情報を格納するようにしている
 * - セッション情報
 */
class RequestWithSession extends Request {
  /**
   * リクエスト内のセッション情報について、正確なモック化に時間がかかりそうなので暫定的にany型で設定している
   * 型安全が確保されていない・補完が効かない等のデメリットがあるため、時間がある時に改善する
   * @todo より正確にモック化する or express-sessionのモック用ライブラリを探す
   */
  session: any

  // Requestクラス内からコンストラクタの記載をコピーしている
  constructor(url?: string | null, options?: IRequestOptions) {
    super(url, options)
  }
}

export { RequestWithSession }
