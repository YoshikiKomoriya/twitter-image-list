import { Router } from 'express'
import { router as authentication } from '~/functions/routes/authentication'
import { router as twitter } from '~/functions/routes/twitter'

const router = Router()

// 認証関係のルーティング
router.use('/authentication', authentication)

// Twitter APIへのリクエストを行うルーティング
router.use('/twitter', twitter)

export { router }
