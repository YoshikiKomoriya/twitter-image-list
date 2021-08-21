/**
 * モジュールエイリアスの設定
 * ExpressサーバーでもNuxtと同様の感覚でソースディレクトリへアクセスできるように、エイリアスを設定する
 */

import path from 'path'
import moduleAlias from 'module-alias'

moduleAlias.addAliases({
  '~': path.resolve(process.cwd(), './src/'),
  '@': path.resolve(process.cwd(), './src/'),
})