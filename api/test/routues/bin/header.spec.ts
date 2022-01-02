import { setCacheControlForPublic } from 'api/routes/bin/header'
import { Response } from 'jest-express/lib/response'

describe('ヘッダーに関する設定', () => {
  describe('レスポンス', () => {
    /**
     * ExpressのRequest・Responseついて、モック用ライブラリを適用するだけではTypeScriptdeで引数の型に関するエラーが発生するため、暫定的にany型を指定している
     * 型安全が確保されていない・補完が効かない等のデメリットがあるため、時間がある時に改善する
     * @todo Express関係のクラスについて問題を調査して、モック上でも型安全を確保する
     */
    let response: any
    beforeEach(() => {
      response = new Response()
    })

    test('キャッシュ設定を追加する（デフォルトの秒数）', () => {
      expect(response.getHeader('Cache-Control')).toBeUndefined()

      setCacheControlForPublic(response)

      expect(response.getHeader('Cache-Control')).toBe('public, max-age=30')
    })

    test('キャッシュ設定を追加する（秒数を指定する）', () => {
      expect(response.getHeader('Cache-Control')).toBeUndefined()

      const maxAge = 100
      setCacheControlForPublic(response, maxAge)

      expect(response.getHeader('Cache-Control')).toBe(
        `public, max-age=${maxAge}`,
      )
    })
  })
})
