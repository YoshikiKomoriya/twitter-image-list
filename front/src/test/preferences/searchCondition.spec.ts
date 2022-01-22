import {
  searchCondition,
  addSearchCondition,
} from '~/preferences/searchCondition'

describe('検索条件', () => {
  test('検索キーワードに、検索条件を追加する', () => {
    const keyword = 'keyword'
    const addedString = `${keyword} ${searchCondition.exclude.retweets} ${searchCondition.filter.media}`

    expect(
      addSearchCondition(
        keyword,
        searchCondition.exclude.retweets,
        searchCondition.filter.media,
      ),
    ).toBe(addedString)
  })
})
