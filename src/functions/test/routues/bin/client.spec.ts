import Boom from 'boom'
import Twitter from 'twitter-lite'
import { Response } from 'jest-express/lib/response'
import { next } from 'jest-express/lib/next'
import { RequestWithSession } from '~/functions/test/util/jest-express'
import { createClient } from '~/functions/routes/bin/client'

// テスト範囲外の依存しているモジュールをモック化
jest.mock('~/functions/bin/dotenv')

describe('client', () => {
  // 値の変動がない共通のパラメータ
  /**
   * ExpressのRequest/Responseについて、モック用ライブラリを適用するだけではTypeScriptdeで引数の型に関するエラーが発生するため、暫定的にany型を指定している
   * 型安全が確保されていない・補完が効かない等のデメリットがあるため、時間がある時に改善する
   * @todo Express関係のクラスについて問題を調査して、モック上でも型安全を確保する
   */
  let response: any
  beforeEach(() => {
    response = new Response()
  })

  test('セッション内に認証情報が存在する場合、クライアントクラスが生成される', () => {
    const request = new RequestWithSession('/') as any
    request.session = {
      accessTokenPair: {
        accessToken: 'testToken',
        accessTokenSecret: 'testTokenSecret',
      },
    }

    createClient(request, response, next)

    expect(request.session.client).toBeInstanceOf(Twitter)
  })

  test('セッション内にクライアントクラスのオインスタンスが存在する場合、何もせず次の処理へ（既存のオインスタンスをそのまま利用する）', () => {
    const twitter = new Twitter({
      consumer_key: 'testConsumerKey',
      consumer_secret: 'testConsumerSecret',
      access_token_key: 'testToken',
      access_token_secret: 'testTokenSecret',
    })

    const request = new RequestWithSession('/') as any
    request.session = {
      client: twitter,
    }

    createClient(request, response, next)

    // 既存のインスタンスが利用されていることを確認したいため、参照IDまで比較するtoBe()を使用する
    expect(request.session.client).toBe(twitter)
  })

  test('セッション内に認証情報が存在しない場合、エラーが返却される', () => {
    const request = new RequestWithSession('/') as any
    request.session = {}

    createClient(request, response, next)

    // エラーメッセージが異なる場合にもテストが失敗するので、修正時には注意する
    expect(next).toHaveBeenCalledWith(
      Boom.forbidden('not loading authentication'),
    )
  })
})
