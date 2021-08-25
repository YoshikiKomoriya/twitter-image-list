/**
 * json-serverで扱うデータの中身
 * 以下の点に注意する
 * - キー名がそのままエンドポイントとなる
 * - 独自のルーティングを設定したファイル（route.ts）も編集する必要がある
 */
// データ量が増えてきたらインターフェイス・クラス等に分割する予定
const db = {
  oauth_request_token: {
    oauth_token: 'Z6eEdO8MOmk394WozF5oKyuAv855l4Mlqo7hhlSLik',
    oauth_token_secret: 'Kd75W4OQfb2oJTV0vzGzeXftVAwgMnEK9MumzYc',
    oauth_callback_confirmed: 'true',
  },
  oauth_request_token_failed: {
    oauth_callback_confirmed: 'false',
  },
  oauth_access_token: {
    oauth_token: '6253282-eWudHldSbIaelX7swmsiHImEL4KinwaGloHANdrY',
    oauth_token_secret: '2EEfA6BG5ly3sR3XjE0IBSnlQu4ZrUzPiYTmrkVU',
    user_id: '6253282',
    screen_name: 'twitterapi',
  },
}

export { db }
