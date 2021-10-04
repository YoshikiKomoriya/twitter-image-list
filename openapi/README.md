# OpenAPI を用いたソースコード生成

Open API Generator を用いて、サーバー・クライアント共通で扱うことのできるソースコードを作成する

## 実行方法

### 型定義ファイルを生成

```shell
$ yarn generate
yarn run v1.22.11
$ yarn generate:code && yarn generate:html
$ openapi-generator-cli generate -i ./schema.yml -g typescript-fetch -o ./generated/ -c ./config.json --additional-properties=npmName=api_name,supportsES6=true,typescriptThreePlus=true
(中略)
################################################################################
# Thanks for using OpenAPI Generator.                                          #
# Please consider donation to help us maintain this project 🙏                 #
# https://opencollective.com/openapi_generator/donate                          #
################################################################################
$ openapi-generator-cli generate -i ./schema.yml -g html -o ./generated/ -c ./config.json --additional-properties=npmName=api_name,supportsES6=true,typescriptThreePlus=true
(中略)
################################################################################
# Thanks for using OpenAPI Generator.                                          #
# Please consider donation to help us maintain this project 🙏                 #
# https://opencollective.com/openapi_generator/donate                          #
################################################################################
✨  Done in 10.05s.
```

## 各ファイルの役割

- `schema.yml` : 型を定義するファイル
  - 行数が大きくなってきたら分割する予定
- `config.json` : ファイル生成に関する設定
- `generated/src/*` : 生成されたソースコード群
  - `src/index.ts`をインポートすると扱いやすいかも
- `generated/index.html` : API ドキュメント（自動生成）

## スキーマファイルについて

### 編集方法

- 編集方法は自由だが、[Swagger Editor](https://editor.swagger.io/)等で書式のチェックを行うことが望ましい
  - VS Code には[拡張機能がある](https://marketplace.visualstudio.com/items?itemName=Arjun.swagger-viewer)

### レスポンスボディの書き方

- レスポンスボディの方を出力したい場合、`#/components/schemas`にスキーマを定義して、`$ref`で参照する
  - 類推しやすいように`Response`をプレフィックスに加えること
  - インラインで書いてしまうと`inlineResponse200`等の類推しにくい型名となってしまうため、これを避けるためスキーマに定義している
    - 参考 : https://tech.smarthr.jp/entry/2020/08/25/135631

```yml
paths:
  /authentication/logout:
    get:
      summary: ログアウト
      description: ログアウト処理を実施する
      operationId: logout
      tags:
        - authentication
      responses:
        '200':
          description: success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ResponseAuthenticationLogout'

components:
  schemas:
    ResponseAuthenticationLogout:
      type: object
      required:
        - result
      properties:
        result:
          type: string
          description: 処理結果
```

## 生成したソースコードの利用方法

### Express

以下の要素それぞれに型情報を適用する

- リクエスト
- レスポンス
- Twitter API のレスポンス

```TypeScript
import * as API from '~openapi/generated/src'
import { Router, Request, Response, NextFunction } from 'express'

const router = Router()

router.get('/endpoint', async (
    // ジェネリクスを用いて、リクエスト・レスポンスに型情報を適用する
    request: Request<any, any, any, API.HogeRequest>,
    response: Response<API.ResponseHoge>,
    next: NextFunction,
) => {
  // Twitter APIのレスポンスは
    const path = 'search/tweets'
    const data: API.ResponseTwitterHoge = await request.client
      ?.get(path, request.query)
      .catch((error) => {
        next(error)
        throw error
      })

    response.json({
      result: 'success',
      data
    })
})
```

#### バリデーション

[express-openapi-validator](https://github.com/cdimascio/express-openapi-validator)を用いて、スキーマファイルで指定された条件にしたがってバリデーション処理を行っている

```TypeScript
import path from 'path'
import * as OpenApiValidator from 'express-openapi-validator'

// Expressの設定
const app = express()

// リクエストのバリデーション設定
const schema = path.resolve(__dirname, '../openapi/schema.yml')
app.use(OpenApiValidator.middleware({ apiSpec: schema }))
```

追加の（スキーマでは表現しきれない複雑な処理が必要な）バリデーションを行う場合は、[express-validator](https://express-validator.github.io/docs/)を用いて別途処理を追加する

### Nuxt

クライアント用ソースコードを読み込み、リクエスト用関数を実行する

```TypeScript
import {
  HogeRequest,
  HogeApi,
} from '~openapi/generated/src'

export default Vue.extend({
  computed() {
    const api = new HogeAPI()
    const parameter: HogeRequest = {
      hoge: 'fuga'
    }

    // requestHoge()の返却値にも型情報が設定されている
    const result = await api.requestHoge(parameter)
    console.log(result)
  }
})

```
