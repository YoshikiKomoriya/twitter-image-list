/**
 * TwitterとのAPI通信に関する設定
 */
import Boom from 'boom'
import { Router, Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { addApplicationClient } from '~/routes/middleware/client'
import { validator } from '~/routes/middleware/validation/search'
import { assertIsString } from '~/routes/bin/assert'
import { encodeQuery } from '~/routes/bin/query'

const router = Router()

// API通信用クライアントクラスの生成を行う
router.use(addApplicationClient)

router.get(
  '/tweets',
  validator.search,
  async (request: Request, response: Response, next: NextFunction) => {
    // バリデーション処理
    const errors = validationResult(request)
    if (errors.isEmpty() === false) {
      return next(Boom.badRequest('パラメータ形式が不正です', errors))
    }

    // バリデーションにより文字列であることが確約されている前提で、TypeScriptに反映させるためにアサーションを行う
    assertIsString(request.query.q)
    // request.queryはパース済みの値であるため、リクエストパラメータにふさわしい値になるように再度エンコードする
    request.query.q = encodeQuery(request.query.q)

    const path = 'search/tweets'

    const result = await request.client
      ?.get(path, request.query)
      .catch((error) => {
        next(error)
        throw error
      })

    response.json(result)
  },
)

export { router }
