import api from 'api/index'
import express from 'express'
import { https } from 'firebase-functions'

// @ts-ignore
import { Nuxt } from 'nuxt'
import config from 'nuxt.config'

const app = express()

config.dev = false
const nuxt = new Nuxt(config)

app.use(async (request, response) => {
  await nuxt.ready()
  nuxt.render(request, response)
})

app.listen(3000, () => {
  console.log(`Server listening on 'localhost:${3000}'.`)
})

exports.nuxtServer = https.onRequest(app)
exports.api = https.onRequest(api.handler)
