/**
 * モジュールエイリアスの設定
 * 各種ディレクトリにアクセスしやすいように、エイリアスを設定する
 */

import path from 'path'
import moduleAlias from 'module-alias'

moduleAlias.addAliases({
  '@': path.resolve(__dirname, '../../../src/'),
  '~': path.resolve(__dirname, '../../../src/'),
})
