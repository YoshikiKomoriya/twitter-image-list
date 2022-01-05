import { Router } from 'express'
import { router as search } from '~/routes/search'
import { router as statuses } from '~/routes/statuses'
import { router as trends } from '~/routes/trends'

const router = Router()

// Twitter APIへのリクエストを行うルーティング
router.use('/search', search)
router.use('/statuses', statuses)
router.use('/trends', trends)

export { router }
