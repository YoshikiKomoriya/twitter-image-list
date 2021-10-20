/**
 * エラーメッセージの一覧
 */

/**
 * HTTP通信に関するエラーメッセージ
 */
const httpErrorMessage = {
  tooManyRequests:
    'リクエスト数が上限に達しました。15分ほど時間をおいて再度お試しください。',
  badRequest:
    'リクエスト形式が不正です。キーワードまたはユーザー名が誤っている可能性があります。',
  default: '通信エラーが発生しました。時間をおいて再度お試しください。',
}

/**
 * HTTP通信に関するエラーメッセージの型
 */
type HttpErrorMessageType =
  typeof httpErrorMessage[keyof typeof httpErrorMessage]

export { httpErrorMessage, HttpErrorMessageType }
