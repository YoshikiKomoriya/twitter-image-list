import { Router } from 'express'
import { router as authentication } from '~/routes/authentication'
import { router as lists } from '~/routes/lists'
import { router as search } from '~/routes/search'
import { router as statuses } from '~/routes/statuses'
import { router as trends } from '~/routes/trends'

const router = Router()

// 認証関係のルーティング
router.use('/authentication', authentication)

// Twitter APIへのリクエストを行うルーティング
router.use('/lists', lists)
router.use('/search', search)
router.use('/statuses', statuses)
router.use('/trends', trends)

export { router }
