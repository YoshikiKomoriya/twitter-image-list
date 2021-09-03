import { AccessTokenResponse, TokenResponse } from 'twitter-lite'
import { Session } from 'express-session'
import axios from 'axios'
import { env } from '~/bin/dotenv'
import { request } from '~/test/util/supertest'
import { authentication } from '~/routes/bin/authentication'

describe('/authentication', () => {
  test('/', async () => {
    // 外部APIと通信する関数のモック化
    const mockGetRequestToken = jest.spyOn(authentication, 'getRequestToken')
    const value: TokenResponse = {
      oauth_token: 'test_oauth_token',
      oauth_token_secret: 'test_oauth_token_secret',
      oauth_callback_confirmed: 'true',
    }
    mockGetRequestToken.mockResolvedValue(value)

    // リクエストの実行
    const response = await request.get('/authentication/')

    // リダイレクト結果の確認
    expect(response.statusCode).toEqual(302)
    expect(response.header.location).toBe(
      authentication.createAuthenticationUrl(value.oauth_token),
    )
  })

  describe('/callback', () => {
    test('正常', async () => {
      // 外部APIと通信する関数のモック化
      const mockGetAccessToken = jest.spyOn(authentication, 'getAccessToken')
      const value: AccessTokenResponse = {
        oauth_token: 'test_oauth_token',
        oauth_token_secret: 'test_oauth_token_secret',
        user_id: 'test_user_id',
        screen_name: 'test_screen_name',
      }
      mockGetAccessToken.mockResolvedValue(value)

      // コールバックで返却された情報をパラメータとして設定する
      // 本来はリダイレクト時のGETパラメータで情報が返却されるが、テスト向けにモックサーバーのレスポンスボディで代用している
      const mockServerOrigin = env.get('MOCK_SERVER_URL')
      const token = (await axios.get(`${mockServerOrigin}/oauth/authenticate`))
        .data
      const recoard = {
        oauth_verifier: token.oauth_verifier,
        oauth_token: token.oauth_token,
      }
      const parameter = new URLSearchParams(recoard)

      // リクエストの実行
      const response = await request.get(
        `/authentication/callback?${parameter.toString()}`,
      )

      // リダイレクト結果の確認
      expect(response.statusCode).toEqual(302)
      expect(response.header.location).toBe('/home')
    })

    test('パラメータが不正な場合、エラーが発生する', async () => {
      // リクエストの実行
      const response = await request.get(`/authentication/callback`)
      expect(response.statusCode).toEqual(400)
    })
  })

  describe('/logout', () => {
    test('正常', async () => {
      const response = await request.get('/authentication/logout')

      expect(response.statusCode).toEqual(200)
      expect(response.body.result).toBe('success')
    })

    test('セッションが破棄でない場合、エラーが発生する', async () => {
      // セッション破棄に関する関数をモック化して、エラーが発生するようにする
      Session.prototype.destroy = jest
        .fn()
        .mockImplementation((fn) => fn(Error('failed.')))

      const response = await request.get('/authentication/logout')

      expect(response.statusCode).toEqual(500)
      expect(response.body.error).toBe('Internal Server Error')
    })
  })
})
