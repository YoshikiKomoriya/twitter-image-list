import Boom from 'boom'
import { Request } from 'jest-express/lib/request'
import { Response } from 'jest-express/lib/response'
import { next } from 'jest-express/lib/next'
import { errorHandler } from '~/bin/errorHandler'

describe('エラーハンドリング', () => {
  // 値の変動がない共通のパラメータ
  let request: any
  let response: any
  beforeEach(() => {
    /**
     * ExpressのRequest/Responseについて、モック用ライブラリを適用するだけではTypeScriptdeで引数の型に関するエラーが発生するため、暫定的にany型を指定している
     * 型安全が確保されていない・補完が効かない等のデメリットがあるため、時間がある時に改善する
     * @todo Express関係のクラスについて問題を調査して、モック上でも型安全を確保する
     */
    request = new Request() as any
    response = new Response() as any
  })

  test('デフォルトのエラーハンドラーによってヘッダーが送信済みの場合、デフォルト処理を続行する', () => {
    const error = Boom.forbidden('test message')
    response.setHeadersSent(true)

    errorHandler(error, request, response, next)

    // デフォルト処理の場合、ステータスコードが既存の200のままである（Boom.forbidden()によって403に変更されることがない）
    expect(response.statusCode).toBe(200)
    expect(next).toHaveBeenCalledWith(error)
  })

  test('エラーの形式がBoomである場合、専用の処理を実施してエラーが表示される', () => {
    const error = Boom.forbidden('test message')

    errorHandler(error, request, response, next)

    // ステータスコードが設定されているかどうか
    expect(response.status).toBeCalledWith(error.output.statusCode)
    expect(response.statusCode).toEqual(error.output.statusCode)

    // レスポンスボディが指定の値になっているかどうか
    expect(response.json).toBeCalledWith(error.output.payload)
    expect(response.body).toBe(error.output.payload)
  })

  test('ヘッダーが未送信・エラー形式が通常の場合に、500番のエラーが返却される', () => {
    const error = new Error('test message')

    errorHandler(error, request, response, next)

    // ステータスコードが設定されているかどうか
    expect(response.status).toBeCalledWith(500)
    expect(response.statusCode).toEqual(500)

    // レスポンスボディが規定の値になっているかどうか
    expect(response.json).toBeCalledWith(error)
    expect(response.body).toBe(error)
  })
})
