/**
 * 検索バーで扱う設定項目
 * オブジェクトのプロパティについて、以下のようなルールで設定している
 * - keyword: キーワード検索向け
 * - user: ユーザー検索向け
 */
const icon = 'mdi-magnify'

const labels = {
  keyword: '検索キーワード',
  user: '検索ユーザー',
}

const rules = {
  keyword: {
    limit: {
      min: 1,
      max: 100, // API上では文字列の最大の長さは100文字としているため、そちらに準拠する
    },
    /**
     * 文字数を数えて、規定数以上の場合はエラーを表示する
     * @param value 入力されたキーワード
     * @returns エラーがない場合はtrue, エラーがある場合はその文言
     */
    counter: (value: string | undefined) => {
      // 未入力の場合はエラーを発生させない
      if (value === undefined) {
        return true
      }

      if (value.length < rules.keyword.limit.min) {
        return 'キーワードを入力してください'
      }

      if (value.length > rules.keyword.limit.max) {
        return 'キーワードが長すぎます'
      }

      return true
    },
  },
  user: {
    // @see https://help.twitter.com/ja/managing-your-account/twitter-username-rules
    limit: {
      min: 1, // 現在のTwitterの仕様では、新規登録時に4文字以下のIDを登録することはできないが、過去に登録済みのものはそのまま使える様子
      max: 15,
    },
    /**
     * 文字数を数えて、規定数以上の場合はエラーを表示する
     * @param value 入力されたユーザーID
     * @returns エラーがない場合はtrue, エラーがある場合はその文言
     */
    counter: (value: string | undefined) => {
      // 未入力の場合はエラーを発生させない
      if (value === undefined) {
        return true
      }

      if (value.length < rules.keyword.limit.min) {
        return 'ユーザーIDを入力してください'
      }

      if (value.length > rules.keyword.limit.max) {
        return 'ユーザーIDが長すぎます'
      }

      return true
    },
  },
}

const pathPrefixes = {
  keyword: 'keyword',
  user: 'user',
}

export { icon, labels, rules, pathPrefixes }
