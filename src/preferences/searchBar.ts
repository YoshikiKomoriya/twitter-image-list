/**
 * 検索バーで扱う設定項目
 * オブジェクトのプロパティについて、以下のようなルールで設定している
 * - keyword: キーワード検索向け
 * - user: ユーザー検索向け
 */

/**
 * 決定ボタンに表示するアイコン
 */
const icon = 'mdi-magnify'

/**
 * バーの上部に表示する文字ラベル
 */
const labels = {
  keyword: '検索キーワード',
  user: '検索ユーザー',
} as const

/**
 * 入力する文字数の制限
 */
const limit = {
  keyword: {
    min: 1,
    max: 100, // API上では文字列の最大の長さは100文字としているため、そちらに準拠する
  },
  /**
   * ユーザー名（ID）の仕様は以下を参照
   * @see https://help.twitter.com/ja/managing-your-account/twitter-username-rules
   */
  user: {
    min: 1, // 現在のTwitterの仕様では、新規登録時に4文字以下のIDを登録することはできないが、過去に登録済みのものはそのまま使える様子
    max: 15,
  },
} as const

/**
 * バリデーションで表示するエラーメッセージ
 */
const errorMessage = {
  keyword: {
    min: 'キーワードを入力してください',
    max: `キーワードが長すぎます。${limit.keyword.max}文字以下で入力してください`,
  },
  user: {
    min: 'ユーザーIDを入力してください',
    max: `ユーザーIDが長すぎます。${limit.user.max}文字以下で入力してください`,
  },
} as const

/**
 * バリデーション用関数
 */
const rules = {
  keyword: {
    /**
     * 文字数を数えて、規定数の範囲を超える場合はエラーを表示する
     * @param value 入力されたキーワード
     * @returns エラーがない場合はtrue, エラーがある場合はその文言
     */
    counter: (value: string | undefined) => {
      // 未入力の場合はエラーを発生させない
      if (value === undefined) {
        return true
      }

      if (value.length < limit.keyword.min) {
        return errorMessage.keyword.min
      }

      if (value.length > limit.keyword.max) {
        return errorMessage.keyword.max
      }

      return true
    },
  },
  user: {
    /**
     * 文字数を数えて、規定数の範囲を超える場合はエラーを表示する
     * @param value 入力されたユーザーID
     * @returns エラーがない場合はtrue, エラーがある場合はその文言
     */
    counter: (value: string | undefined) => {
      // 未入力の場合はエラーを発生させない
      if (value === undefined) {
        return true
      }

      if (value.length < limit.user.min) {
        return errorMessage.user.min
      }

      if (value.length > limit.user.max) {
        return errorMessage.user.max
      }

      return true
    },
  },
} as const

/**
 * 画面の遷移先に指定するパス情報
 */
const pathPrefixes = {
  keyword: 'keyword',
  user: 'user',
} as const

export { icon, labels, limit, errorMessage, rules, pathPrefixes }
