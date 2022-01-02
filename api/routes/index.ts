import { router as authentication } from 'api/routes/authentication'
import { router as lists } from 'api/routes/lists'
import { router as search } from 'api/routes/search'
import { router as statuses } from 'api/routes/statuses'
import { router as trends } from 'api/routes/trends'
import { Router } from 'express'

const router = Router()

// 認証関係のルーティング
router.use('/authentication', authentication)

// Twitter APIへのリクエストを行うルーティング
router.use('/lists', lists)
router.use('/search', search)
router.use('/statuses', statuses)
router.use('/trends', trends)

export { router }
