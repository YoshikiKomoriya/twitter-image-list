import { Response } from 'jest-express/lib/response'
import { next } from 'jest-express/lib/next'
import Twitter from 'twitter-lite'
import Boom from 'boom'
import { verifyAuthentication } from '~/functions/routes/middleware/authenticated'
import { RequestWithSession } from '~/functions/test/util/jest-express'

describe('認証済みであるかどうか', () => {
  /**
   * ExpressのRequest・Responseついて、モック用ライブラリを適用するだけではTypeScriptdeで引数の型に関するエラーが発生するため、暫定的にany型を指定している
   * 型安全が確保されていない・補完が効かない等のデメリットがあるため、時間がある時に改善する
   * @todo Express関係のクラスについて問題を調査して、モック上でも型安全を確保する
   */
  let response: any
  beforeEach(() => {
    response = new Response()
  })

  test('認証済みである場合、次の処理へ移る', () => {
    const request = new RequestWithSession() as any
    const twitter = new Twitter({
      consumer_key: 'testConsumerKey',
      consumer_secret: 'testConsumerSecret',
      access_token_key: 'testAccessToken',
      access_token_secret: 'testAccessTokenSecret',
    })
    request.session.client = twitter

    verifyAuthentication(request, response, next)

    // 「引数が渡されていない」ことをテストするため、引数を含めてチェックする関数を使用する
    expect(next).toHaveBeenCalledWith()
  })

  test('認証済みでない（未認証orセッション切れ）場合、エラーが返却される', () => {
    const request = new RequestWithSession() as any

    verifyAuthentication(request, response, next)

    // エラーメッセージが異なる場合にもテストが失敗するので、修正時には注意する
    expect(next).toHaveBeenCalledWith(Boom.forbidden('not authenticated'))
  })
})
