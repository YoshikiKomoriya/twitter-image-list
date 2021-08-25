/**
 * TwitterとのAPI通信に関する設定
 */
import { Request, Response, Router } from 'express'
import { verifyAuthentication } from '~/functions/routes/middleware/authenticated'

const router = Router()

// 認証情報の検証を行う
router.use(verifyAuthentication)

/**
 * APIのリクエスト処理に関する共通処理
 * @param request リクエスト情報
 * @param response レスポンス情報
 * @param endpoint Twitter APIのエンドポイント
 * @param parameters APIのリクエストに付与するパラメータ
 * @returns Twitter APIの通信結果をレスポンスとして出力する。エラーの場合にも出力のみ行われる点に注意する
 */
const requestApi = async (
  request: Request,
  response: Response,
  endpoint: string,
  parameters?: object,
) => {
  try {
    const result = await request.session.client?.get(endpoint, parameters)
    response.json(result)
  } catch (e) {
    response.json(e)
  }
}

router.get('/lists/list', async (request, response) => {
  const path = 'lists/list'
  await requestApi(request, response, path)
})

/**
 * 実装のアイデアに関するメモ
 * 下記のように正規表現を使ったルーティングにすることで、パスとして渡ってきた文字列をそのままTwitter APIのエンドポイントに転用することが可能である
 * e.g. https://localhost:3000/server/twitter/statuses/home_timeline => 'statuses/home_timeline'
 * しかし、タイポやイタズラによって存在しないエンドポイントへのアクセスが可能となるため、扱いには注意が必要だと考えている
 * （どうせエラーを返すだけだしそこまで神経質になる必要もないと思うが、無意味なリクエストが連続で発生することによってTwitter側に迷惑がかかるのを避けたい）
 * そのため、パス情報の検証フィルタをミドルウェアで実装して、そちらを事前に通すようにすると行儀の良いリクエストが行えると思う
 * （軽く探してみたが、良さげなライブラリ等は見つからず…）
 *
 * @todo 検証フィルタを実装する
 */
/**
router.get(/^\/(.*)\/?$/i, async (request, response) => {
  const path = request.params[0]
  try {
    const result = await request.session.client?.get(path)
    response.json(result)
  } catch (e) {
    response.json(e)
  }
})
*/

export { router }
