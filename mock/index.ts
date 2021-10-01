import './bin/moduleAlias'
import { NextFunction, Request, Response } from 'express'
import jsonServer from 'json-server'
import { route as customRoute } from '~/route'
import { db } from '~/db/index'

const app = jsonServer.create()
const middlewares = jsonServer.defaults()
const router = jsonServer.router(db)
const port = 5000

app.use(middlewares)

// GET以外のリクエストについても、特定のレスポンスを返却する（GETと同様の動作）のみとする
/**
 * json-serverのデフォルトではそれぞれRESTful（登録・更新・削除）な機能を担っていて、データの操作を行うことができる
 * しかし、このモックでは実際の処理まで行う必要はなく、特定のレスポンスさえ返却されれば十分であるため、変更している
 */
app.use(jsonServer.bodyParser)
app.use((request: Request, _response: Response, next: NextFunction) => {
  if (
    request.method === 'POST' ||
    request.method === 'PUT' ||
    request.method === 'PATCH' ||
    request.method === 'DELETE' ||
    request.method === 'OPTIONS'
  ) {
    request.method = 'GET'
  }
  next()
})

// ルーティング処理
/**
 * json-serverのデフォルトではルーティングのパスに'/'の文字が扱えない
 * Twitter APIのエンドポイントと同様のルーティングにしたいため、パス情報の書き換えを行う点に注意する
 */
app.use(jsonServer.rewriter(customRoute))
app.use(router)

app.listen(port, () => {
  // Linterで警告が発生するが、サーバー内部のログ出力であるため問題はないと考えている
  // eslint-disable-next-line no-console
  console.log('JSON Server is running.')
})
