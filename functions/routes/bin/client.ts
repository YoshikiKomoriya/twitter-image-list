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
  bearerToken: string,
) => {
  /**
   * Twitterの仕様上、ベアラートークンを使用したアプリケーション認証において、コンシューマーキー・シークレットの入力は不要である
   * しかし、'twitter-lite'上では必須項目となっている（ライブラリ上の不具合）
   * 動作上に大きな問題はないため、問題が解決するまで、コンシューマーキー・シークレットの入力を行なった上でアプリケーション認証を行う
   * （Issueが挙げられてプルリクエストも作成されているため、近いうちに修正されると思われる）
   *
   * @todo バージョンアップによる修正を確認できたら、コンシューマーキー・シークレットに関する処理を削除する
   * @see https://github.com/draftbit/twitter-lite/issues/171
   */
  const option: TwitterOptions = {
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    bearer_token: bearerToken,
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
