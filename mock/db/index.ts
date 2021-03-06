/**
 * json-serverで扱うデータの中身
 * 以下の点に注意する
 * - キー名がそのままエンドポイントとなる
 * - 独自のルーティングを設定したファイル（route.ts）も編集する必要がある
 */
// データ量の多いものは別のファイルに分割する
import { db as searchTweets } from '~/db/searchTweets'
import { db as searchTweetsImage } from '~/db/searchTweetsImage'
import { db as searchTweetsVideo } from '~/db/searchTweetsVideo'
import { db as statusesUserTimeline } from '~/db/statusesUserTimeline'
import { db as trendsPlace } from '~/db/trendsPlace'

const db = {
  // レート制限時のエラーレスポンス
  rate_limit: {
    errors: [
      {
        code: 88,
        message: 'Rate limit exceeded',
      },
    ],
  },
  oauth_request_token: {
    oauth_token: 'Z6eEdO8MOmk394WozF5oKyuAv855l4Mlqo7hhlSLik',
    oauth_token_secret: 'Kd75W4OQfb2oJTV0vzGzeXftVAwgMnEK9MumzYc',
    oauth_callback_confirmed: 'true',
  },
  oauth_authenticate: {
    oauth_token: 'test_oauth_token',
    oauth_verifier: 'test_oauth_verifier',
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
  lists_ownerships: {
    next_cursor: 46541288,
    next_cursor_str: '46541288',
    previous_cursor: 0,
    previous_cursor_str: '0',
    lists: [
      {
        id: 84839422,
        id_str: '84839422',
        name: 'Official Twitter accts',
        uri: '/twitter/official-twitter-accts',
        subscriber_count: 20,
        member_count: 0,
        mode: 'public',
        description: 'Accounts managed by Twitter, Inc. ',
        slug: 'official-twitter-accts',
        full_name: '@twitter/official-twitter-accts',
        created_at: 'Tue Feb 05 18:14:21 +0000 2013',
        following: false,
        user: {
          id: 783214,
          id_str: '783214',
          name: 'Twitter',
          screen_name: 'twitter',
          location: 'San Francisco, CA',
          description:
            'Your official source for news, updates and tips from Twitter, Inc.',
          url: 'http://blog.twitter.com/',
          entities: {
            url: {
              urls: [
                {
                  url: 'http://blog.twitter.com/',
                  expanded_url: null,
                  indices: [0, 24],
                },
              ],
            },
            description: {
              urls: [],
            },
          },
          protected: false,
          followers_count: 17214319,
          friends_count: 120,
          listed_count: 76232,
          created_at: 'Tue Feb 20 14:35:54 +0000 2007',
          favourites_count: 22,
          utc_offset: -28800,
          time_zone: 'Pacific Time (US & Canada)',
          geo_enabled: true,
          verified: true,
          statuses_count: 1563,
          lang: 'en',
          contributors_enabled: false,
          is_translator: false,
          profile_background_color: 'ACDED6',
          profile_background_image_url: '...',
          profile_background_image_url_https: '...',
          profile_background_tile: true,
          profile_image_url: '...',
          profile_image_url_https: '...',
          profile_banner_url:
            'https://si0.twimg.com/profile_banners/783214/1347405327',
          profile_link_color: '038543',
          profile_sidebar_border_color: 'EEEEEE',
          profile_sidebar_fill_color: 'F6F6F6',
          profile_text_color: '333333',
          profile_use_background_image: true,
          default_profile: false,
          default_profile_image: false,
          following: true,
          follow_request_sent: false,
          notifications: false,
        },
      },
      {
        id: 46541288,
        id_str: '46541288',
        name: 'D9',
        uri: '/twitter/d9',
        subscriber_count: 340,
        member_count: 327,
        mode: 'public',
        description: 'D9 attendees with a Twitter account',
        slug: 'd9',
        full_name: '@twitter/d9',
        created_at: 'Tue May 31 16:29:35 +0000 2011',
        following: false,
        user: {
          id: 783214,
          id_str: '783214',
          name: 'Twitter',
          screen_name: 'twitter',
          location: 'San Francisco, CA',
          description:
            'Your official source for news, updates and tips from Twitter, Inc.',
          url: 'http://blog.twitter.com/',
          entities: {
            url: {
              urls: [
                {
                  url: 'http://blog.twitter.com/',
                  expanded_url: null,
                  indices: [0, 24],
                },
              ],
            },
            description: {
              urls: [],
            },
          },
          protected: false,
          followers_count: 17214319,
          friends_count: 120,
          listed_count: 76232,
          created_at: 'Tue Feb 20 14:35:54 +0000 2007',
          favourites_count: 22,
          utc_offset: -28800,
          time_zone: 'Pacific Time (US & Canada)',
          geo_enabled: true,
          verified: true,
          statuses_count: 1563,
          lang: 'en',
          contributors_enabled: false,
          is_translator: false,
          profile_background_color: 'ACDED6',
          profile_background_image_url: '...',
          profile_background_image_url_https: '...',
          profile_background_tile: true,
          profile_image_url: '...',
          profile_image_url_https: '...',
          profile_banner_url:
            'https://si0.twimg.com/profile_banners/783214/1347405327',
          profile_link_color: '038543',
          profile_sidebar_border_color: 'EEEEEE',
          profile_sidebar_fill_color: 'F6F6F6',
          profile_text_color: '333333',
          profile_use_background_image: true,
          default_profile: false,
          default_profile_image: false,
          following: true,
          follow_request_sent: false,
          notifications: false,
        },
      },
    ],
  },
  search_tweets: searchTweets,
  search_tweets_image: searchTweetsImage,
  search_tweets_video: searchTweetsVideo,
  statuses_user_timeline: statusesUserTimeline,
  trends_place: trendsPlace,
}

export { db }
