/**
 * TwitterとのAPI通信に関する設定
 */
import { Router, Request, Response } from 'express'
import { addUserClient } from '~/routes/middleware/client'
import { verifyAuthentication } from '~/routes/middleware/authenticated'
import { ResponseListsOwnerships } from '~openapi/generated/src'

const router = Router()

// 認証情報の検証を行う
router.use(verifyAuthentication)

// API通信用クライアントクラスの生成を行う
router.use(addUserClient)

router.get(
  '/ownerships',
  async (request: Request, response: Response, next) => {
    const path = '/lists/ownerships'

    const result: ResponseListsOwnerships = await request.client
      ?.get(path)
      .catch((error) => {
        next(error)
        throw error
      })

    response.json(result)
  },
)

export { router }
