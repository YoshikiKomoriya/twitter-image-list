# mock

Twitter API をモック化したサーバー

## 実行方法

### サーバーの起動

```shell
# ROOTディレクトリの場合
$ yarn mock
yarn run v1.22.11
$ ./src/functions/mock/node_modules/nodemon/bin/nodemon.js --ext ts --watch './src/functions/mock/**/*' --exec './src/functions/mock/node_modules/.bin/ts-node' ./src/functions/mock/index.ts
[nodemon] 2.0.12
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/functions/mock/**/*
[nodemon] watching extensions: ts
[nodemon] starting `./src/functions/mock/node_modules/.bin/ts-node ./src/functions/mock/index.ts`
JSON Server is running.

# ROOT/src/functions/mock/ 配下の場合
$ yarn start
yarn run v1.22.11
$ nodemon --ext ts --watch src --exec './node_modules/.bin/ts-node' index.ts
[nodemon] 2.0.12
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src
[nodemon] watching extensions: ts
[nodemon] starting `./node_modules/.bin/ts-node index.ts`
JSON Server is running.
```

### 動作確認

```shell
$ curl http://localhost:3000/oauth/request_token
{
  "oauth_token": "Z6eEdO8MOmk394WozF5oKyuAv855l4Mlqo7hhlSLik",
  "oauth_token_secret": "Kd75W4OQfb2oJTV0vzGzeXftVAwgMnEK9MumzYc",
  "oauth_callback_confirmed": "true"
}
```

## 各ファイルの役割

- `index.ts` : サーバーの起動ファイル
- `db.ts` : エンドポイント・返却されるデータの設定
- `route.ts` : 独自のルーティング設定

## 実行環境について

ライブラリ'json-server'について、若干力技で TypeScript 対応を行っている
[フォーク先リポジトリで正式に TypeScript に対応する](https://github.com/typicode/json-server/issues/833)等の議論も出ているため、それらが確定次第追従する予定

```json
  "scripts": {
    "start": "nodemon --ext ts --watch src --exec './node_modules/.bin/ts-node' index.ts"
  },
```

参考 : https://github.com/typicode/json-server/issues/833#issuecomment-518195711
