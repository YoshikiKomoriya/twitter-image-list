/**
 * キーワード検索
 */
import { assertIsTwitterClient } from 'api/routes/bin/assert'
import { generateBoomError } from 'api/routes/bin/generateBoomError'
import { setCacheControlForPublic } from 'api/routes/bin/header'
import { addApplicationClient } from 'api/routes/middleware/client'
import Boom from 'boom'
import { Request, Response, Router } from 'express'
import {
  ResponseSearchTweets,
  SearchTweetRequest,
} from '~openapi/generated/src'

const router = Router()

// API通信用クライアントクラスの生成を行う
router.use(addApplicationClient)

router.get(
  '/tweets',
  async (
    request: Request<any, any, any, SearchTweetRequest>,
    response: Response<ResponseSearchTweets>,
    next,
  ) => {
    // ミドルウェアで生成されたクライアントクラスの検証
    assertIsTwitterClient(request.client)

    // APIリクエスト
    const path = '/search/tweets'
    const result: ResponseSearchTweets = await request.client
      .get(path, request.query)
      .catch((error) => {
        return generateBoomError(error)
      })

    // エラーが出力されている場合、エラーハンドリングへ移行する
    if (result instanceof Boom) {
      return next(result)
    }

    setCacheControlForPublic(response)
    response.json(result)
  },
)

export { router }
