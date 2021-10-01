/**
 * TwitterとのAPI通信に関する設定
 */
import Boom from 'boom'
import { Router, Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { addApplicationClient } from '~/routes/middleware/client'
import { validator } from '~/routes/middleware/validation/search'
import * as API from '~openapi/generated/src'

const router = Router()

// API通信用クライアントクラスの生成を行う
router.use(addApplicationClient)

router.get(
  '/tweets',
  validator.search,
  async (
    request: Request<any, any, any, API.SearchTweetRequest>,
    response: Response<API.ResponseSearchTweets>,
    next: NextFunction,
  ) => {
    // バリデーション処理
    const errors = validationResult(request)
    if (errors.isEmpty() === false) {
      return next(Boom.badRequest('パラメータ形式が不正です', errors))
    }

    const path = 'search/tweets'

    const result: API.ResponseSearchTweets = await request.client
      ?.get(path, request.query)
      .catch((error) => {
        next(error)
        throw error
      })

    response.json(result)
  },
)

export { router }
