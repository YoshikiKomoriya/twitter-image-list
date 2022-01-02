/**
 * トレンド
 */
import { assertIsTwitterClient } from 'api/routes/bin/assert'
import { generateBoomError } from 'api/routes/bin/generateBoomError'
import { setCacheControlForPublic } from 'api/routes/bin/header'
import { addApplicationClient } from 'api/routes/middleware/client'
import Boom from 'boom'
import { Request, Response, Router } from 'express'
import { Trends, TrendsPlaceRequest } from '~openapi/generated/src'

const router = Router()

// API通信用クライアントクラスの生成を行う
router.use(addApplicationClient)

router.get(
  '/place',
  async (
    request: Request<any, any, any, TrendsPlaceRequest>,
    response: Response<Trends>,
    next,
  ) => {
    // ミドルウェアで生成されたクライアントクラスの検証
    assertIsTwitterClient(request.client)

    // APIリクエスト
    const path = '/trends/place'
    const result: Trends = await request.client
      .get(path, request.query)
      .catch((error) => {
        return generateBoomError(error)
      })

    // エラーが出力されている場合、エラーハンドリングへ移行する
    if (result instanceof Boom) {
      return next(result)
    }

    setCacheControlForPublic(response, 300) // トレンド機能はメインとなるものではないため、高頻度で更新せずとも満足度は損なわれないと考え、長めにキャッシュ時間を設定している
    response.json(result)
  },
)

export { router }
