import Twitter from 'twitter-lite'
import {
  createApplicationClient,
  createUserClient,
} from '~/functions/routes/bin/client'

describe('コンシューマーキーを使用したアプリケーション用クライアントクラス', () => {
  test('クライアントクラスが生成される', () => {
    const key = 'testKey'
    const secret = 'testSecret'

    const client = createApplicationClient(key, secret)

    expect(client).toBeInstanceOf(Twitter)
  })
})

describe('アクセストークンを使用したユーザー用クライアントクラス', () => {
  test('クライアントクラスが生成される', () => {
    const consumerKey = 'testConsumerKey'
    const consumerSecret = 'testConsumerSecret'
    const accessToken = 'testToken'
    const accessTokenSecret = 'testTokenSecret'

    const client = createUserClient(
      consumerKey,
      consumerSecret,
      accessToken,
      accessTokenSecret,
    )

    expect(client).toBeInstanceOf(Twitter)
  })
})
