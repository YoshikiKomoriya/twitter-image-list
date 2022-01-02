import axios from 'axios'
import Twitter from 'twitter-lite'
import { env } from '~/bin/dotenv'
import { request } from '~/test/util/supertest'

describe('/search', () => {
  // すべてのテストで利用する変数
  const mockServerOrigin = env.get('MOCK_SERVER_URL')

  // クエリパラメータの有効な範囲
  const rule = {
    query: {
      max: 100,
    },
    count: {
      min: 1,
      max: 100,
    },
  }

  // テスト向けにモックの初期化を行う
  let mockGet: jest.SpyInstance
  beforeEach(async () => {
    mockGet = jest.spyOn(Twitter.prototype, 'get')

    // モックサーバーに接続して、レスポンス内容を取得するように設定する
    const value = (await axios.get(`${mockServerOrigin}/search/tweets`)).data
    mockGet.mockResolvedValue(value)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('/search/tweets', () => {
    test('正常なリクエスト（キーワードのみ指定）', async () => {
      const parameter = new URLSearchParams({ q: 'test' }).toString()

      const response = await request.get(`/search/tweets?${parameter}`)

      expect(response.statusCode).toEqual(200)
      expect(response.header['cache-control']).toBe('public, max-age=30')
    })

    test('正常なリクエスト（すべてのオプションを指定）', async () => {
      const parameter = new URLSearchParams({
        q: 'test',
        count: '30',
        max_id: '967574182522482687',
      }).toString()

      const response = await request.get(`/search/tweets?${parameter}`)

      expect(response.statusCode).toEqual(200)
      expect(response.header['cache-control']).toBe('public, max-age=30')
    })

    test('キーワードの指定がない', async () => {
      const response = await request.get('/search/tweets')

      expect(response.statusCode).toEqual(400)
      expect(response.body.error).toBe('Bad Request')
    })

    test('キーワードが空文字', async () => {
      const parameter = new URLSearchParams({ q: '' }).toString()

      const response = await request.get(`/search/tweets?${parameter}`)

      expect(response.statusCode).toEqual(400)
      expect(response.body.error).toBe('Bad Request')
    })

    test('キーワードが規定数をオーバーしている', async () => {
      const query = 'テスト'.repeat(rule.query.max + 1)
      const parameter = new URLSearchParams({ q: query }).toString()

      const response = await request.get(`/search/tweets?${parameter}`)

      expect(response.statusCode).toEqual(400)
      expect(response.body.error).toBe('Bad Request')
    })

    test.each([
      rule.count.min,
      /**
       * 最小〜最大の間の整数
       * @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
       */
      Math.floor(
        Math.random() * (rule.count.max - rule.count.min) + rule.count.min,
      ),
      rule.count.max,
    ])('取得数が正常な範囲内（%p件）', async (count) => {
      const parameter = new URLSearchParams({
        q: 'test',
        count: count.toString(),
      }).toString()

      const response = await request.get(`/search/tweets?${parameter}`)

      expect(response.statusCode).toEqual(200)
    })

    test('取得数が有効な値未満', async () => {
      const count = rule.count.min - 1
      const parameter = new URLSearchParams({
        q: 'test',
        count: count.toString(),
      }).toString()

      const response = await request.get(`/search/tweets?${parameter}`)

      expect(response.statusCode).toEqual(400)
      expect(response.body.error).toBe('Bad Request')
    })

    test('取得数が有効な値以上', async () => {
      const count = rule.count.max + 1
      const parameter = new URLSearchParams({
        q: 'test',
        count: count.toString(),
      }).toString()

      const response = await request.get(`/search/tweets?${parameter}`)

      expect(response.statusCode).toEqual(400)
      expect(response.body.error).toBe('Bad Request')
    })

    test('max_idが文字列で指定されている', async () => {
      const maxId = '967574182522482687'
      const parameter = new URLSearchParams({
        q: 'test',
        max_id: maxId,
      }).toString()

      const response = await request.get(`/search/tweets?${parameter}`)

      expect(response.statusCode).toEqual(200)
      expect(response.header['cache-control']).toBe('public, max-age=30')
    })

    test('max_idがオブジェクトとしてパースされる文字列で指定されている', async () => {
      const maxId = '967574182522482687'

      // 書式が特殊なため、URLSearchParamsは扱わず文字列で表現する
      const response = await request.get(
        `/search/tweets?q=test&max_id[]=${maxId}&max_id[test]=${maxId}`,
      )

      expect(response.statusCode).toEqual(400)
      expect(response.body.error).toBe('Bad Request')
    })

    test('レート制限エラーが返却される', async () => {
      // エラーのレスポンス内容を設定する
      const value = (await axios.get(`${mockServerOrigin}/rate_limit`)).data
      mockGet.mockRejectedValue(value)

      const parameter = new URLSearchParams({ q: 'test' }).toString()
      const response = await request.get(`/search/tweets?${parameter}`)

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

      const parameter = new URLSearchParams({ q: 'test' }).toString()
      const response = await request.get(`/search/tweets?${parameter}`)

      expect(response.statusCode).toEqual(500)
    })
  })
})
