import Twitter, { AccessTokenResponse, TokenResponse } from 'twitter-lite'
import axios from 'axios'
import Boom from 'boom'
import { authentication } from '~/functions/routes/bin/authentication'
import { env } from '~/functions/bin/dotenv'

describe('認証用トークン', () => {
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
      await axios.get('http://localhost:3000/oauth/request_token')
    ).data
    mockGetRequestToken.mockResolvedValue(response)

    // リクエストの実行
    const callbackUrl = 'https://example.com'
    const token = await authentication.requestToken(twitter, callbackUrl)

    expect(typeof token.oauth_token).toBe('string')
    expect(typeof token.oauth_token_secret).toBe('string')
    expect(token.oauth_callback_confirmed).toMatch('true')
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
      await axios.get('http://localhost:3000/oauth/request_token/failed')
    ).data
    mockGetRequestToken.mockResolvedValue(response)

    // リクエストの実行と検証
    expect(authentication.requestToken(twitter, callbackUrl)).rejects.toThrow(
      Boom.badRequest('OAuth callback is not confirmed'),
    )
  })

  test('認証用トークンを用いて認証画面のURLを生成する', () => {
    // URLの設定
    process.env.AUTHENTICATION_URL = 'http://localhost:3000/oauth/authenticate'
    const baseUrl = env.get('AUTHENTICATION_URL')
    const token = 'testToken'

    // URLの組み立て
    const validUrl = `${baseUrl}?oauth_token=${token}`
    const createdUrl = authentication.createAuthenticationUrl(token)

    expect(createdUrl).toMatch(validUrl)
  })

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
      await axios.get('http://localhost:3000/oauth/access_token')
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

    // TypeScriptによってレスポンスの型検証は行われているはずなので、明示的に検証する要素は通信用クライアントの生成に必要なもののみとしている
    expect(typeof accessToken.oauth_token).toBe('string')
    expect(typeof accessToken.oauth_token_secret).toBe('string')
  })
})
