import { errorMessage, labels, limit, rules } from '~/preferences/searchBar'

describe.each([
  [
    labels.keyword,
    {
      key: 'keyword',
      label: labels.keyword,
      limit: limit.keyword,
      counter: rules.keyword.counter,
      errorMessage: errorMessage.keyword,
    },
  ],
  [
    labels.user,
    {
      key: 'user',
      label: labels.user,
      limit: limit.user,
      counter: rules.user.counter,
      errorMessage: errorMessage.user,
    },
  ],
])('検索バーの設定（%p）', (_label, table) => {
  test('規定数の文字列を入力できる', () => {
    expect(table.counter('a'.repeat(table.limit.min))).toBe(true)
  })

  test('何も入力されていない（入力前）場合、エラーが発生しない', () => {
    expect(table.counter(undefined)).toBe(true)
  })

  test('規定数未満の文字列を入力した場合、エラーが発生する', () => {
    expect(table.counter('a'.repeat(table.limit.min - 1))).toBe(
      table.errorMessage.min,
    )
  })

  test('規定数より多い文字列を入力した場合、エラーが発生する', () => {
    expect(table.counter('a'.repeat(table.limit.max + 1))).toBe(
      table.errorMessage.max,
    )
  })
})
