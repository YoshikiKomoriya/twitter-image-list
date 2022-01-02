import Boom from 'boom'
import { next } from 'jest-express/lib/next'
import { Response } from 'jest-express/lib/response'
import Twitter, { AccessTokenResponse } from 'twitter-lite'
import { addApplicationClient, addUserClient } from '~/routes/middleware/client'
import { RequestWithSession } from '~/test/util/jest-express'

describe('API通信用クライアントクラスの生成', () => {
  /**
   * ExpressのRequest・Responseついて、モック用ライブラリを適用するだけではTypeScriptdeで引数の型に関するエラーが発生するため、暫定的にany型を指定している
   * 型安全が確保されていない・補完が効かない等のデメリットがあるため、時間がある時に改善する
   * @todo Express関係のクラスについて問題を調査して、モック上でも型安全を確保する
   */
  let response: any
  beforeEach(() => {
    response = new Response()
  })

  test('アプリケーション向けクライアントクラスを生成する', () => {
    const request = new RequestWithSession() as any
    addApplicationClient(request, response, next)

    expect(request.client).toBeInstanceOf(Twitter)

    // 「引数が渡されていない」ことをテストするため、引数を含めてチェックする関数を使用する
    expect(next).toHaveBeenCalledWith()
  })

  test('認証済みの場合、ユーザー向けクライアントクラスを生成する', () => {
    const request = new RequestWithSession() as any
    const user: AccessTokenResponse = {
      oauth_token: 'test_oauth_token',
      oauth_token_secret: 'test_oauth_token_secret',
      user_id: 'test_user_id',
      screen_name: 'test_screen_name',
    }
    request.session.user = user

    addUserClient(request, response, next)

    expect(request.client).toBeInstanceOf(Twitter)

    // 「引数が渡されていない」ことをテストするため、引数を含めてチェックする関数を使用する
    expect(next).toHaveBeenCalledWith()
  })

  test('ユーザー向けクライアントクラス生成時に、認証済みでない（未認証orセッション切れ）場合、エラーが返却される', () => {
    const request = new RequestWithSession() as any

    addUserClient(request, response, next)

    // エラーメッセージが異なる場合にもテストが失敗するので、修正時には注意する
    expect(next).toHaveBeenCalledWith(Boom.forbidden('not authenticated'))
  })
})
