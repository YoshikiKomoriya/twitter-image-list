import Boom from 'boom'

/**
 * Twitter APIの通信のエラーハンドリング
 * エラー内容を解析して、専用の形式に変換する
 */
const generateBoomError = (error: any) => {
  if (isRateLimit(error)) {
    return Boom.tooManyRequests(error.errors[0].message, error)
  }

  return Boom.internal('Twitter APIの通信でエラーが発生しました', error)
}

/**
 * APIレート制限が行われているかどうかを判定する
 * @param error 'twitter-lite'のエラーレスポンス
 * @returns 検証結果
 */
const isRateLimit = (error: any) => {
  if (error.errors[0]?.code !== 88) {
    return false
  }

  return true
}

export { generateBoomError }
