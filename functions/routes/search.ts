/**
 * TwitterとのAPI通信に関する設定
 */
import Boom from 'boom'
import { Router, Request, Response, NextFunction } from 'express'
import { addApplicationClient } from '~/routes/middleware/client'
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
    next: NextFunction,
  ) => {
    // APIリクエスト
    const path = 'search/tweets'
    const result: ResponseSearchTweets = await request.client
      ?.get(path, request.query)
      .catch((error) => {
        // レート制限の場合、専用のエラーを出力する
        if (error.errors[0].code === 88) {
          const boom = Boom.tooManyRequests(error.errors[0].message, error)
          next(boom)
          throw boom
        }

        next(error)
        throw error
      })

    response.json(result)
  },
)

export { router }
