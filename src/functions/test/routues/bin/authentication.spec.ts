import Boom from 'boom'
import { Response } from 'jest-express/lib/response'
import { next } from 'jest-express/lib/next'
import { RequestWithSession } from '~/functions/test/util/jest-express'
import { verifyAuthentication } from '~/functions/routes/bin/authentication'

describe('authentication', () => {
  // 値の変動がない共通のパラメータ
  let response: any
  beforeEach(() => {
    /**
     * ExpressのRequest/Responseについて、モック用ライブラリを適用するだけではTypeScriptdeで引数の型に関するエラーが発生するため、暫定的にany型を指定している
     * 型安全が確保されていない・補完が効かない等のデメリットがあるため、時間がある時に改善する
     * @todo Express関係のクラスについて問題を調査して、モック上でも型安全を確保する
     */
    response = new Response()
  })

  test('セッション内に認証情報が存在する場合、何もせず次の処理へ', () => {
    const request = new RequestWithSession('/') as any
    request.session = {
      accessTokenPair: {
        accessToken: 'testToken',
        accessTokenSecret: 'testTokenSecret',
      },
    }

    verifyAuthentication(request, response, next)

    // 「引数が渡されていない」ことをテストするため、引数を含めてチェックする関数を使用する
    expect(next).toHaveBeenCalledWith()
  })

  test('セッション内に認証情報が存在しない（未認証orセッション切れ）場合、エラーが返却される', () => {
    const request = new RequestWithSession('/') as any
    request.session = {}

    verifyAuthentication(request, response, next)

    // エラーメッセージが異なる場合にもテストが失敗するので、修正時には注意する
    expect(next).toHaveBeenCalledWith(Boom.forbidden('not authenticated'))
  })
})
