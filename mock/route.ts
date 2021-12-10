/**
 * json-serverで扱う独自のパス情報
 * キー : 値 = パス : 実質的なアクセス先 となっている
 */
const route = {
  '/oauth/request_token': '/oauth_request_token',
  '/oauth/request_token/failed': '/oauth_request_token_failed',
  '/oauth/authenticate': '/oauth_authenticate',
  '/oauth/access_token': '/oauth_access_token',
  '/lists/ownerships': '/lists_ownerships',
  '/search/tweets': '/search_tweets',
  '/search/tweets[0-9a-zA-Z?=]+': '/search_tweets',
  '/search/tweets/image': '/search_tweets_image',
  '/search/tweets/video': '/search_tweets_video',
  '/statuses/user_timeline': '/statuses_user_timeline',
  '/statuses/user_timeline[0-9a-zA-Z?=]+': '/statuses_user_timeline',
  '/trends/place': '/trends_place',
}

export { route }
