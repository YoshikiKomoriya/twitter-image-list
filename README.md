# TWISTTER（ツイスター）

Twitter 画像検索&ダウンロードツール（仮）

## セットアップ

### フロントエンド

事前に[ローカル開発環境の HTTPS 化対応](./doc/ローカル開発環境のHTTPS化対応.md)の作業が必要

```bash
# 作業ディレクトリへの移動
$ cd front

# ライブラリのインストール
$ yarn install

# 開発環境の立ち上げ
$ yarn dev

# ビルド・サーバーの立ち上げ
$ yarn build
$ yarn start

# テストの実行
$ yarn test
```

### バックエンド（API サーバー）

```bash
# 作業ディレクトリへの移動
$ cd api

# ライブラリのインストール
$ yarn install

# テストの実行
$ yarn test

# サーバーの立ち上げ（単体）
## 通常はフロントの開発環境立ち上げと同時に実行されるため、単体で立ち上げる必要はない
## 主にデバッグ向け
$ yarn start
```

### モックサーバー

```bash
# 作業ディレクトリへの移動
$ cd mock

# サーバーの立ち上げ（単体）
$ yarn start
```

### API 定義書（OpenAPI）

事前に Java 環境の用意が必要

```bash
# 作業ディレクトリへの移動
$ cd openapi

# ソースコード生成
$ yarn generate
```
