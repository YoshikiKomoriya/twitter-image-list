/**
 * Twitter認証に関する専門の処理
 */
import { URL } from 'url'
import Boom from 'boom'
import Twitter from 'twitter-lite'
import { env } from '~/bin/dotenv'

/**
 * Twitterに認証用トークンを発行するように依頼する
 * @param client 通信用クライアントクラス
 * @param callbackUrl 許可されているコールバックURL
 * @returns 認証用トークンの情報
 * @throws {@link Error} 通信中にエラーが発生した場合
 * @throws {@link Boom.badRequest} 通信には成功したが、コールバックURLが許可されていなかった場合
 */
const getRequestToken = async (client: Twitter, callbackUrl: string) => {
  // Twitterに認証用トークン情報を発行するよう依頼する
  const requestToken = await client
    .getRequestToken(callbackUrl)
    .catch((error) => {
      throw error
    })

  // リクエストが確認されたかどうか検証する
  // 比較対象が**文字列である**点に注意すること
  if (requestToken.oauth_callback_confirmed === 'false') {
    throw Boom.badRequest('OAuth callback is not confirmed')
  }

  return requestToken
}

/**
 * Twitterの認証画面のURLを生成する
 * @param oauthToken 認証用トークン
 * @returns 認証画面のURL
 */
const createAuthenticationUrl = (oauthToken: string) => {
  // 設定されたTwitterの認証用エンドポイントに、リクエストパラメータを追加する
  const baseUrl = env.get('AUTHENTICATION_URL')
  const parsedUrl = new URL(baseUrl)
  parsedUrl.searchParams.append('oauth_token', oauthToken)

  return parsedUrl.toString()
}

/**
 * 認証用トークンを用いて、ユーザーのアクセストークンを取得する
 * @param client 通信用クライアントクラス
 * @param oauthVerifier 認証済みであることを示すトークン
 * @param oauthToken 認証用トークン
 * @returns アクセストークン
 * @throws {@link Error} 通信中にエラーが発生した場合
 */
const getAccessToken = async (
  client: Twitter,
  oauthVerifier: string,
  oauthToken: string,
) => {
  const accessTokenOptions = {
    oauth_verifier: oauthVerifier,
    oauth_token: oauthToken,
  }
  const accessToken = await client
    .getAccessToken(accessTokenOptions)
    .catch((error) => {
      throw error
    })

  return accessToken
}

const authentication = {
  getRequestToken,
  createAuthenticationUrl,
  getAccessToken,
}

export { authentication }
