/**
 * TwitterとのAPI通信用クライアントクラスを生成する
 */
import Twitter, { TwitterOptions } from 'twitter-lite'

/**
 * コンシューマーキーを使用したAPI通信用クライアントクラスを生成する
 * @param consumerKey コンシューマーキー
 * @param consumerSecret コンシューマーシークレット
 * @returns 通信用クライアントクラス
 */
const createApplicationClient = (
  consumerKey: string,
  consumerSecret: string,
) => {
  const option: TwitterOptions = {
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
  }
  const client = new Twitter(option)

  return client
}

/**
 * アクセストークンを使用したAPI通信用クライアントクラスを生成する
 * @param consumerKey コンシューマーキー
 * @param consumerSecret コンシューマーシークレット
 * @param accessToken アクセストークン
 * @param accessTokenSecret アクセストークンシークレット
 * @returns 通信用クライアントクラス
 */
const createUserClient = (
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessTokenSecret: string,
) => {
  const option: TwitterOptions = {
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    access_token_key: accessToken,
    access_token_secret: accessTokenSecret,
  }
  const client = new Twitter(option)

  return client
}

export { createApplicationClient, createUserClient }
