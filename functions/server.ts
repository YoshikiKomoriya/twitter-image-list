import fs from 'fs'
import https from 'https'
import path from 'path'
import app from './index'

// サーバーの基本的な設定
const port = 3000
const options = {
  key: fs.readFileSync(
    path.resolve(__dirname, '../cert/', 'localhost-key.pem'),
  ),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/', 'localhost.pem')),
}

// Nuxtの設定と同様に、ルーティングにPrefixを付与する
app.handler.use('/server', app.handler._router)

const server = https.createServer(options, app.handler)
server.listen(port, () => {
  // Linterで警告が発生するが、サーバー内部のログ出力であるため問題はないと考えている
  // eslint-disable-next-line no-console
  console.log('Express Server is running.')
})
