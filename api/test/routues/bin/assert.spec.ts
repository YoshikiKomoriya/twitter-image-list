import Twitter from 'twitter-lite'
import { assertIsTwitterClient } from '~/routes/bin/assert'

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
      // 言語から提供されるもの
      'test', // 文字列
      1, // 数値型
      1n, // bigint
      true, // 真偽型
      Symbol('hoge'), // symbol,
      undefined, // 未定義
      { test: 'test' }, // オブジェクト
      ['test'], // 配列（型はオブジェクトとして判定される点に注意する）
      () => {}, // 関数

      // アプリケーション上で利用する独自のクラス
      new Twitter({ consumer_key: 'test', consumer_secret: 'test' }), // Twitter通信用クライアント
    ]

    // 型情報を追加する
    data = values.map((value) => {
      return {
        type: typeof value,
        value,
      }
    })
  })

  test('Twitter通信用クライアント', () => {
    // 検証に合格するデータのみ抽出する
    const filteredData = data.filter((data) => {
      try {
        assertIsTwitterClient(data.value)
        return true
      } catch (e) {
        return false
      }
    })

    filteredData.forEach((data) => {
      expect(data.value instanceof Twitter)
    })
  })

  test('失敗時の検証', () => {
    data.forEach((data) => {
      try {
        /**
         * @todo より汎用的な型のアサーション処理を実装したら、そちらに切り替える
         */
        assertIsTwitterClient(data.value)
      } catch (e) {
        expect(assertIsTwitterClient).toThrow(TypeError('assertion failed.'))
      }
    })
  })
})
