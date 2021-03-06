import dotenv from 'dotenv'
import { env } from '~/bin/dotenv'

describe('.envファイル', () => {
  test('.envファイルが読み込めない場合に、エラーが発生する', () => {
    // .envファイルが読み込めなかった状態をモックで作成する
    const mockConfig = jest.spyOn(dotenv, 'config')
    mockConfig.mockReturnValue({
      error: undefined,
      parsed: undefined,
    })

    expect(() => {
      env.config()
    }).toThrow(TypeError('.envファイルの値が取得できませんでした'))
  })

  test('.envファイルに未定義の環境変数がある場合、エラーが発生する', () => {
    // .envファイルに未定義の環境変数がある状態をモックで作成する
    const mockConfig = jest.spyOn(dotenv, 'config')

    // オブジェクトのプロパティへのアクセスに変数を使いたいため、少し周りくどい形で定義している
    const key = 'TEST_KEY'
    const parsed: { [key: string]: string } = {}
    parsed[key] = ''

    mockConfig.mockReturnValue({
      error: undefined,
      parsed,
    })

    const message = `
以下の環境変数が定義されていません

${key}
`
    expect(() => {
      env.config()
    }).toThrow(TypeError(message))
  })
})

describe('環境変数', () => {
  test('環境変数から値を取得する', () => {
    const key = 'TEST_KEY'
    const value = 'test'
    process.env[key] = value

    const gotValue = env.get(key)

    expect(gotValue).toBe(value)
  })

  test('環境変数に値が定義されていない場合、エラーが発生する', () => {
    const key = 'TEST_KEY'
    delete process.env[key]

    expect(() => {
      env.get(key)
    }).toThrow(TypeError(`環境変数 ${key} が定義されていません`))
  })
})
