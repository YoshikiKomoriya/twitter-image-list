import Boom from 'boom'

/**
 * Twitter APIのエラーレスポンス
 * 通信・認可フローが経由された後にエラーが発生すると、この形式のレスポンスが返却される
 */
type ErrorResponse = {
  errors: { code: number; message: string }[]
}

/**
 * Twitter APIの通信のエラーハンドリング
 * エラー内容を解析して、専用の形式に変換する
 */
const generateBoomError = (error: any) => {
  // エラーコードが記されている場合は、それに沿った内容にする
  if (isIncludeErrorCode(error)) {
    return getBoomFromErrorCode(error)
  }

  if (isNotAuthorized(error)) {
    return Boom.unauthorized('この操作には認可が必要です')
  }

  return Boom.internal('Twitter APIの通信でエラーが発生しました', error)
}

/**
 * エラーオブジェクトがエラーコードを含んでいるかどうかを判定する
 * @param error 'twitter-lite'のエラーレスポンス
 * @returns 検証結果
 */
const isIncludeErrorCode = (error: any) => {
  if (Array.isArray(error.errors) === false) {
    return false
  }

  if (typeof error.errors[0].code !== 'number') {
    return false
  }

  return true
}

/**
 * エラーオブジェクトのエラーコードから、最適なBoomオブジェクトを生成する
 * @param error 'twitter-lite'のエラーレスポンス
 * @returns エラー情報を含むBoomオブジェクト
 */
const getBoomFromErrorCode = (error: ErrorResponse) => {
  switch (error.errors[0].code) {
    case 34:
      return Boom.notFound('指定のリソースが見つかりません', error)
    case 88:
      return Boom.tooManyRequests('レート制限に達しました', error)
    default:
      return Boom.internal(
        '想定外のエラーが発生しました。エラーコードを参照してください',
        error,
      )
  }
}

/**
 * 認可されていない操作であるかどうかを判定する
 * @param error 'twitter-liteのエラーレスポンス
 * @returns 検証結果
 */
const isNotAuthorized = (error: any) => {
  if (error.error !== 'Not authorized.') {
    return false
  }

  return true
}

export { ErrorResponse, isIncludeErrorCode, generateBoomError }
