import Twitter from 'twitter-lite'
import axios from 'axios'
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

  test('/lists/ownerships', async () => {
    // モックサーバーに接続して、レスポンス内容を取得するように設定する
    const value = await axios.get(`${mockServerOrigin}/lists/ownerships`)
    mockGet.mockResolvedValue(value)

    const response = await authenticatedRequest.get('/lists/ownerships')

    expect(response.statusCode).toEqual(200)
  })
})