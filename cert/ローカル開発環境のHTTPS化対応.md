# ローカル開発環境のHTTPS化対応

## 証明書を作成する

mkcert を使って、自己署名入り証明書（オレオレ証明書）を作成する

```bash
$ brew install mkcert
$ mkcert -install
Created a new certificate valid for the following names 📜
 - "localhost"

The certificate is at "./localhost.pem" and the key at "./localhost-key.pem" ✅
```

## 証明書を設置する

root/cert/ 配下に作成した cert と key を設置する

## 設定ファイルに証明書を設定する

root/nuxt.config.js に以下の記載を追加する

```js
import path from 'path'
import fs from 'fs'

export default {
server: {
  https: {
    key: fs.readFileSync(path.resolve(__dirname, 'cert/', 'localhost-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, 'cert/', 'localhost.pem')),
  },
},
```

## 開発サーバーを起動する

```bash
yarn run dev
```
