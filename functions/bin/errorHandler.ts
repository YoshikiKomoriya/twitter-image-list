/**
 * Expressのエラーハンドリングに関する設定
 */
import Boom from 'boom'
import { Request, Response, NextFunction } from 'express'

interface ExtendedPayload extends Boom.Payload {
  data?: any
  additionalMessage?: string
}

/**
 * エラーハンドリングの処理
 * @param error エラー情報を示す何らかのオブジェクト
 * @param _request リクエスト情報
 * @param response レスポンス情報
 * @param next Express上で次の処理へ移るための関数
 * @returns ヘッダーが送信済みの場合はデフォルトのエラーハンドリングを続行する、それ以外はエラー情報をレスポンスに出力して処理を終了する
 */
const errorHandler = (
  /**
   * Expressは、NextFunction(any) を実行する（第一引数に何かしらのものを入れる）だけで、エラー処理へ遷移するらしい…
   * そのため、ここではany型を受け付ける
   * @see http://expressjs.com/ja/guide/error-handling.html
   */
  error: any,
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  // デフォルトのエラーハンドラーによってヘッダーが送信されている場合は、その後の処理もデフォルト処理に委任する
  if (response.headersSent) {
    return next(error)
  }

  // エラーがBoomの形式である場合、専用の処理を実施してエラーを出力する
  if (error instanceof Boom && error.isBoom) {
    response.status(error.output.statusCode)

    // 独自のデータが設定されている場合、それも出力対象とする
    const output: ExtendedPayload = error.output.payload
    output.data = error.data ? error.data : undefined

    response.json(output)
    return
  }

  response.status(500)
  response.json(error)
}

export { errorHandler }
