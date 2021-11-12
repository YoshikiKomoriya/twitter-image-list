import axios from 'axios'
import Twitter from 'twitter-lite'
import { env } from '~/bin/dotenv'
import { authenticatedRequest } from '~/test/util/supertest'

describe('/list', () => {
  // すべてのテストで利用する変数
  const mockServerOrigin = env.get('MOCK_SERVER_URL')

  // テスト向けにモックの初期化を行う
  let mockGet: jest.SpyInstance
  beforeEach(() => {
    mockGet = jest.spyOn(Twitter.prototype, 'get')
  })

  test('自身が所有するリストの取得', async () => {
    // モックサーバーに接続して、レスポンス内容を取得するように設定する
    const value = (await axios.get(`${mockServerOrigin}/lists/ownerships`)).data
    mockGet.mockResolvedValue(value)

    const response = await authenticatedRequest.get('/lists/ownerships')

    expect(response.statusCode).toEqual(200)
  })

  test('レート制限エラーが返却される', async () => {
    // エラーのレスポンス内容を設定する
    const value = (await axios.get(`${mockServerOrigin}/rate_limit`)).data
    mockGet.mockRejectedValue(value)

    const response = await authenticatedRequest.get('/lists/ownerships')

    expect(response.statusCode).toEqual(429)
  })

  test('Twitter APIの通信でエラーが返却される', async () => {
    // エラーのレスポンス内容を設定する
    mockGet.mockRejectedValue({
      errors: [
        {
          code: 0,
          message: 'error',
        },
      ],
    })

    const response = await authenticatedRequest.get('/lists/ownerships')

    expect(response.statusCode).toEqual(500)
  })
})
