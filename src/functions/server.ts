import fs from 'fs'
import path from 'path'
import https from 'https'
import app from './index'

// サーバーの基本的な設定
const port = 3000
const options = {
  key: fs.readFileSync(
    path.resolve(__dirname, '../../cert/', 'localhost-key.pem'),
  ),
  cert: fs.readFileSync(
    path.resolve(__dirname, '../../cert/', 'localhost.pem'),
  ),
}

// Nuxtの設定と同様に、ルーティングにPrefixを付与する
app.handler.use('/server', app.handler._router)

const server = https.createServer(options, app.handler)
server.listen(port, () => {
  console.log('Express Server is running.')
})
