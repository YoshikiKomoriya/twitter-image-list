/**
 * Twitter APIの検索APIで使う検索条件
 */
const searchCondition = {
  // 特定の種別に絞り込む
  filter: {
    twimg: 'filter:twimg',
  },
  // 特定の要素を除外する
  exclude: {
    retweets: 'exclude:retweets',
  },
  // 各パラメータの区切り文字
  separetor: ' ',
} as const

type SearchConditionType = typeof searchCondition[keyof typeof searchCondition]

export { searchCondition, SearchConditionType }
