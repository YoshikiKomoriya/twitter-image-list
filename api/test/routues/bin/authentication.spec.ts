import { env } from 'api/bin/dotenv'
import { authentication } from 'api/routes/bin/authentication'
import axios from 'axios'
import Boom from 'boom'
import Twitter, { AccessTokenResponse, TokenResponse } from 'twitter-lite'

describe('認証用トークンの発行', () => {
  // すべてのテストで利用する変数
  const mockServerOrigin = env.get('MOCK_SERVER_URL')

  test('トークンの発行を依頼する', async () => {
    const options = {
      consumer_key: 'test',
      consumer_secret: 'test',
    }
    const twitter = new Twitter(options)

    // リクエスト送信に関する関数をモック化して、実行状況を検証する
    const mockGetRequestToken = jest.spyOn(twitter, 'getRequestToken')

    // Twitter APIのモックサーバーから情報を取得して、関数の戻り値とする
    const response: TokenResponse = (
      await axios.get(`${mockServerOrigin}/oauth/request_token`)
    ).data
    mockGetRequestToken.mockResolvedValue(response)

    // リクエストの実行
    const callbackUrl = 'https://example.com'
    const token = await authentication.getRequestToken(twitter, callbackUrl)

    expect(typeof token.oauth_token).toBe('string')
    expect(typeof token.oauth_token_secret).toBe('string')
    expect(token.oauth_callback_confirmed).toMatch('true')
  })

  test('通信エラーが発生した場合', () => {
    const options = {
      consumer_key: 'test',
      consumer_secret: 'test',
    }
    const twitter = new Twitter(options)
    const callbackUrl = 'https://example.com'

    // リクエスト送信に関する関数をモック化して、実行状況を検証する
    const mockGetRequestToken = jest.spyOn(twitter, 'getRequestToken')
    mockGetRequestToken.mockRejectedValue({ error: 'test' })

    // リクエストの実行と検証
    expect(
      authentication.getRequestToken(twitter, callbackUrl),
    ).rejects.toThrow(Boom.internal('通信エラーが発生しました'))
  })

  test('トークンの発行を依頼するが、Twitterから許可されていないため不正なリクエストだとエラーが発生する', async () => {
    const options = {
      consumer_key: 'test',
      consumer_secret: 'test',
    }
    const twitter = new Twitter(options)
    const callbackUrl = 'https://example.com'

    // リクエスト送信に関する関数をモック化して、実行状況を検証する
    const mockGetRequestToken = jest.spyOn(twitter, 'getRequestToken')

    // Twitter APIのモックサーバーから情報を取得して、関数の戻り値とする
    const response: TokenResponse = (
      await axios.get(`${mockServerOrigin}/oauth/request_token/failed`)
    ).data
    mockGetRequestToken.mockResolvedValue(response)

    // リクエストの実行と検証
    expect(
      authentication.getRequestToken(twitter, callbackUrl),
    ).rejects.toThrow(Boom.badRequest('OAuth callback is not confirmed'))
  })
})

describe('認証画面のURLの発行', () => {
  // すべてのテストで利用する変数
  const mockServerOrigin = env.get('MOCK_SERVER_URL')

  test('認証用トークンを用いて認証画面のURLを生成する', () => {
    // なるべくソースと同じ形（環境変数から認証用URL取得→パラメータ組み立て→リクエスト実行）で処理ができるように、先に認証用URLをテスト用のものに上書きする
    process.env.AUTHENTICATION_URL = `${mockServerOrigin}/oauth/authenticate`

    // URLとトークン情報の取得
    const baseUrl = env.get('AUTHENTICATION_URL')
    const token = 'testToken'

    // URLの組み立て
    const validUrl = `${baseUrl}?oauth_token=${token}`
    const createdUrl = authentication.createAuthenticationUrl(token)

    expect(createdUrl).toMatch(validUrl)
  })
})

describe('アクセストークンの取得', () => {
  // すべてのテストで利用する変数
  const mockServerOrigin = env.get('MOCK_SERVER_URL')

  test('認証用トークンを用いて、ユーザーのアクセストークンを取得する', async () => {
    const options = {
      consumer_key: 'test',
      consumer_secret: 'test',
    }
    const twitter = new Twitter(options)

    // リクエスト送信に関する関数をモック化して、実行状況を検証する
    const mockGetAccessToken = jest.spyOn(twitter, 'getAccessToken')

    // Twitter APIのモックサーバーから情報を取得して、関数の戻り値とする
    const response: AccessTokenResponse = (
      await axios.get(`${mockServerOrigin}/oauth/access_token`)
    ).data
    mockGetAccessToken.mockResolvedValue(response)

    // リクエストの実行
    const oauthVerifier = 'oauthVerifier'
    const oauthToken = 'oauthToken'
    const accessToken = await authentication.getAccessToken(
      twitter,
      oauthVerifier,
      oauthToken,
    )

    // 通信用クライアントの生成に必要なもののみ検証している
    expect(typeof accessToken.oauth_token).toBe('string')
    expect(typeof accessToken.oauth_token_secret).toBe('string')
  })

  test('通信エラーが発生した場合', () => {
    const options = {
      consumer_key: 'test',
      consumer_secret: 'test',
    }
    const twitter = new Twitter(options)

    // リクエスト送信に関する関数をモック化して、実行状況を検証する
    const mockGetAccessToken = jest.spyOn(twitter, 'getAccessToken')
    mockGetAccessToken.mockRejectedValue({ error: 'test' })

    // リクエストの実行と検証
    const oauthVerifier = 'oauthVerifier'
    const oauthToken = 'oauthToken'
    expect(
      authentication.getAccessToken(twitter, oauthVerifier, oauthToken),
    ).rejects.toThrow(Boom.internal('通信エラーが発生しました'))
  })
})
