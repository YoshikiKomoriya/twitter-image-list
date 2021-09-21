import { Router } from 'express'
import { router as authentication } from '~/routes/authentication'
import { router as lists } from '~/routes/lists'
import { router as search } from '~/routes/search'

const router = Router()

// 認証関係のルーティング
router.use('/authentication', authentication)

// Twitter APIへのリクエストを行うルーティング
router.use('/lists', lists)
router.use('/search', search)

export { router }
