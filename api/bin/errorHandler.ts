/**
 * Expressのエラーハンドリングに関する設定
 */
import Boom from 'boom'
import { NextFunction, Request, Response } from 'express'
import { HttpError } from 'express-openapi-validator/dist/framework/types'

/**
 * レスポンスボディの出力形式
 */
interface ErrorResponse {
  /**
   * HTTPステータスのメッセージ
   * e.g. 'Bad Request'
   */
  error: string

  /**
   * エラー詳細が記されたメッセージ
   */
  message: string

  /**
   * エラーに関する補助的なデータ
   * スタックトレース・生のエラーオブジェクト等
   */
  data?: any

  [key: string]: any
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

  // エラーがopen-api-validatorのものである場合、専用の処理を実施してエラーを出力する
  if (error instanceof HttpError) {
    const output: ErrorResponse = {
      error: error.name,
      message: error.message,
      data: error.errors,
    }

    response.status(error.status)
    response.json(output)
    return
  }

  // エラーがBoomの形式である場合、専用の処理を実施してエラーを出力する
  if (error instanceof Boom) {
    const output: ErrorResponse = {
      error: error.output.payload.error,
      message: error.message,
    }
    // 独自のデータが設定されている場合、それも出力対象とする
    if (error.data) {
      output.data = error.data
    }

    response.status(error.output.statusCode)
    response.json(output)
    return
  }

  response.status(500)
  response.json(error)
}

export { errorHandler, ErrorResponse }
