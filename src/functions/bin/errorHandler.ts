/**
 * Expressのエラーハンドリングに関する設定
 */
import Boom from 'boom'
import { Request, Response, NextFunction } from 'express'

/**
 * エラーハンドリングの処理
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
    response.json(error.output.payload)
    return
  }

  response.status(500)
  response.json(error)
}

export { errorHandler }
