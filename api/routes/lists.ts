/**
 * TwitterとのAPI通信に関する設定
 */
import { assertIsTwitterClient } from 'api/routes/bin/assert'
import { generateBoomError } from 'api/routes/bin/generateBoomError'
import { verifyAuthentication } from 'api/routes/middleware/authenticated'
import { addUserClient } from 'api/routes/middleware/client'
import Boom from 'boom'
import { Request, Response, Router } from 'express'
import { ResponseListsOwnerships } from '~openapi/generated/src'

const router = Router()

// 認証情報の検証を行う
router.use(verifyAuthentication)

// API通信用クライアントクラスの生成を行う
router.use(addUserClient)

router.get(
  '/ownerships',
  async (request: Request, response: Response, next) => {
    // ミドルウェアで生成されたクライアントクラスの検証
    assertIsTwitterClient(request.client)

    // APIリクエスト
    const path = '/lists/ownerships'
    const result: ResponseListsOwnerships = await request.client
      .get(path)
      .catch((error) => {
        return generateBoomError(error)
      })

    // エラーが出力されている場合、エラーハンドリングへ移行する
    if (result instanceof Boom) {
      return next(result)
    }

    response.json(result)
  },
)

export { router }
