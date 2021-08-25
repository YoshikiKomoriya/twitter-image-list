/**
 * json-serverで扱う独自のパス情報
 * キー : 値 = パス : 実質的なアクセス先 となっている
 */
const route = {
  '/oauth/request_token': '/oauth_request_token',
  '/oauth/request_token/failed': '/oauth_request_token_failed',
  '/oauth/access_token': '/oauth_access_token',
}

export { route }
