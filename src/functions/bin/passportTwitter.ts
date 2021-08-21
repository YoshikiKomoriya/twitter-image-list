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
