/**
 * 独自のエラークラス
 */

/**
 * 独自のエラークラス
 * エラーメッセージの他に、独自のデータを扱う
 *
 * @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
 */
class CustomError extends Error {
  constructor(...params: any) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }

    this.name = 'CustomError'
  }
}

/**
 * メディアのダウンロードで発生するエラー
 * **リカバリー可能なエラー**として、なるべくcatchする運用にすることを推奨する
 * （リカバリー不可能なエラーは標準で組み込まれているエラーを使う想定）
 */
class MediaDownloadError extends CustomError {
  data: any

  constructor(
    param: string | { message: string; data: any },
    ...params: any[]
  ) {
    // 第1引数にデータが指定されている場合、変数に格納する
    if (param instanceof Object) {
      super(param.message, ...params)
      this.data = param.data
    } else {
      super(param, ...params)
    }

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (CustomError.captureStackTrace) {
      CustomError.captureStackTrace(this, MediaDownloadError)
    }

    this.name = 'MediaDownloadError'
  }
}

export { CustomError, MediaDownloadError }
