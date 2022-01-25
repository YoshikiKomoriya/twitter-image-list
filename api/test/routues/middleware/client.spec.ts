import { next } from 'jest-express/lib/next'
import { Request } from 'jest-express/lib/request'
import { Response } from 'jest-express/lib/response'
import Twitter from 'twitter-lite'
import { addApplicationClient } from '~/routes/middleware/client'

describe('API通信用クライアントクラスの生成', () => {
  test('アプリケーション向けクライアントクラスを生成する', () => {
    /**
     * ExpressのRequest・Responseついて、モック用ライブラリを適用するだけではTypeScriptdeで引数の型に関するエラーが発生するため、暫定的にany型を指定している
     * 型安全が確保されていない・補完が効かない等のデメリットがあるため、時間がある時に改善する
     * @todo Express関係のクラスについて問題を調査して、モック上でも型安全を確保する
     */
    const request = new Request() as any
    const response = new Response() as any
    addApplicationClient(request, response, next)

    expect(request.client).toBeInstanceOf(Twitter)

    // 「引数が渡されていない」ことをテストするため、引数を含めてチェックする関数を使用する
    expect(next).toHaveBeenCalledWith()
  })
})
