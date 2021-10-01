/**
 * モジュールエイリアスの設定
 * 各種ディレクトリにアクセスしやすいように、エイリアスを設定する
 */

import path from 'path'
import moduleAlias from 'module-alias'

moduleAlias.addAliases({
  '@': path.resolve(__dirname, '../'),
  '~': path.resolve(__dirname, '../'),
  '~openapi/*': path.resolve(__dirname, '../../openapi'),
  '@openapi/*': path.resolve(__dirname, '../../openapi'),
})
