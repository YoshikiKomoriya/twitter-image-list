/**
 * passportのTwitter利用に関する設定
 */
import { Strategy, IStrategyOptionWithRequest, Verify } from 'passport-twitter'
import { env } from '~/functions/bin/dotenv'

const callbackUrl = 'https://localhost:3000/server/authentication/callback'
const option: IStrategyOptionWithRequest = {
  consumerKey: env.get('CONSUMER_KEY'),
  consumerSecret: env.get('CONSUMER_SECRET'),
  callbackURL: callbackUrl,
  passReqToCallback: true,
}

/**
 * 認証後の処理
 * @param request リクエスト情報
 * @param accessToken アクセストークン
 * @param refreshToken アクセストークンシークレット
 * @param profile 認証によって得られるユーザー情報
 * @param done 処理が完了した際に実行される関数
 * @returns 引数done()が実行される
 */
const verify: Verify = (request, accessToken, refreshToken, profile, done) => {
  /**
   * 認証によって得られたトークン情報はセッション情報に格納する
   */
  request.session.accessTokenPair = {
    accessToken,
    accessTokenSecret: refreshToken,
  }
  return done(null, profile)
}

const strategy = new Strategy(option, verify)

export { strategy }
