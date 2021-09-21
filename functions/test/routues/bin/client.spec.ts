import Twitter from 'twitter-lite'
import { createApplicationClient, createUserClient } from '~/routes/bin/client'

describe('コンシューマーキーを使用したアプリケーション用クライアントクラス', () => {
  test('クライアントクラスが生成される', () => {
    const key = 'testKey'
    const secret = 'testSecret'
    const bearerToken = 'testToken'

    const client = createApplicationClient(key, secret, bearerToken)

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
