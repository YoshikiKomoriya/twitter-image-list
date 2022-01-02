import axios from 'axios'
import Twitter from 'twitter-lite'
import { env } from '~/bin/dotenv'
import { request } from '~/test/util/supertest'

describe('/trends', () => {
  // すべてのテストで利用する変数
  const mockServerOrigin = env.get('MOCK_SERVER_URL')

  // テスト向けにモックの初期化を行う
  let mockGet: jest.SpyInstance
  beforeEach(async () => {
    mockGet = jest.spyOn(Twitter.prototype, 'get')

    // モックサーバーに接続して、レスポンス内容を取得するように設定する
    const value = (await axios.get(`${mockServerOrigin}/trends/place`)).data
    mockGet.mockResolvedValue(value)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('正常なリクエスト', async () => {
    const parameter = new URLSearchParams({ id: '1' }).toString()

    const response = await request.get(`/trends/place?${parameter}`)

    expect(response.statusCode).toEqual(200)
    expect(response.header['cache-control']).toBe('public, max-age=300')
  })

  test('必須パラメータ（ID）の指定がない場合、バリデーションエラーが返却される', async () => {
    const response = await request.get('/trends/place')

    expect(response.statusCode).toEqual(400)
    expect(response.body.error).toBe('Bad Request')
  })

  test('レート制限エラーが返却される', async () => {
    // エラーのレスポンス内容を設定する
    const value = (await axios.get(`${mockServerOrigin}/rate_limit`)).data
    mockGet.mockRejectedValue(value)

    const parameter = new URLSearchParams({ id: '1' }).toString()
    const response = await request.get(`/trends/place?${parameter}`)

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

    const parameter = new URLSearchParams({ id: '1' }).toString()
    const response = await request.get(`/trends/place?${parameter}`)

    expect(response.statusCode).toEqual(500)
  })
})
