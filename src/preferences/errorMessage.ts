/**
 * エラーメッセージの一覧
 */

/**
 * HTTP通信に関するエラーメッセージ
 */
const messages = {
  badRequest:
    'リクエスト形式が不正です。キーワードまたはユーザー名が誤っている可能性があります。',
  tooManyRequests:
    'リクエスト数が上限に達しました。15分ほど時間をおいて再度お試しください。',
  notFound:
    '指定のユーザーが見つかりません。キーワードまたはユーザー名が誤っている可能性があります。',
  unauthorized:
    'この操作には許可が必要です。対象が非公開ユーザーである可能性があります。',
  default: '通信エラーが発生しました。時間をおいて再度お試しください。',
} as const

/**
 * HTTP通信に関するエラー一覧
 */
const errors = {
  400: messages.badRequest,
  401: messages.unauthorized,
  404: messages.notFound,
  429: messages.tooManyRequests,
} as const

export { messages, errors }
