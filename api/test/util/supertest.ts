/**
 * ライブラリ'supertest'のインスタンス生成処理をモジュール化したもの
 */
import supertest from 'supertest'
import app from '~/index'

const request = supertest(app.handler)

export { request }
