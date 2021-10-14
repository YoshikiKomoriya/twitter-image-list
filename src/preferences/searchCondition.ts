/**
 * Twitter APIの検索APIで使う検索条件
 */
const searchCondition = {
  // 特定の種別に絞り込む
  filter: {
    media: 'filter:media',
  },
  // 特定の要素を除外する
  exclude: {
    retweets: 'exclude:retweets',
  },
  // 各パラメータの区切り文字
  separetor: ' ',
} as const

type SearchConditionType = typeof searchCondition[keyof typeof searchCondition]

/**
 * 検索キーワードに対して、検索条件を追加する
 * @param keyword 検索キーワード
 * @param condition 検索条件
 * @returns 検索条件を加えたキーワード
 */
const addSearchCondition = (keyword: string, ...condition: string[]) => {
  // 配列に検索キーワード・各条件を指定して、仕切り用の文字列で結合する
  const baseParameter = [keyword]
  const parameters = baseParameter.concat(condition)
  const query = parameters.join(searchCondition.separetor)

  return query
}

export { searchCondition, SearchConditionType, addSearchCondition }
