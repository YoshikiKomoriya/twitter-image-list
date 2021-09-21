import { assertIsString } from '~/routes/bin/assert'

// テストデータ用の型情報
type Data = {
  type: string // 型
  value: any // 実際の値
}

describe('型に関する検証処理（アサーション）', () => {
  let data: Data[]
  beforeEach(() => {
    // テスト用データ
    const values = [
      'test', // 文字列
      1, // 数値型
      1n, // bigint
      true, // 真偽型
      Symbol('hoge'), // symbol,
      undefined, // 未定義
      { test: 'test' }, // オブジェクト
      ['test'], // 配列（型はオブジェクトとして判定される点に注意する）
      () => {}, // 関数
    ]

    // 型情報を追加する
    data = values.map((value) => {
      return {
        type: typeof value,
        value,
      }
    })
  })

  test('文字列型', () => {
    // 検証に合格するデータのみ抽出する
    const filteredData = data.filter((data) => {
      try {
        assertIsString(data.value)
        return true
      } catch (e) {
        return false
      }
    })

    filteredData.forEach((data) => {
      expect(data.type).toBe('string')
    })
  })
})
