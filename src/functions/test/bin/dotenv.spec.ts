import { env } from '~/functions/bin/dotenv'

describe('dotenv', () => {
  test('.envファイルを読み込む', () => {
    // 事前にファイルが読み込まれていないことを確認するため、.envファイルに記載のあるキー名の値を検証する
    const key = 'APP_TITLE'
    expect(process.env[key]).toBeUndefined()

    // .envファイルの読み込み
    env.config()

    // ファイルが読み込まれたことにより、.envファイルに記載のあるキー名の値が'文字列で'取得できる
    expect(typeof process.env[key]).toBe('string')
  })

  test('環境変数から値を取得する', () => {
    const key = 'TEST_VALUE'
    const value = 'test'
    process.env[key] = value

    const gotValue = env.get(key)

    expect(gotValue).toBe(value)
  })
})
