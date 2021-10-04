import { query } from 'express-validator'
import { encodeQuery } from '~/routes/bin/query'

// 各パラメータの数値や文字列の条件
const rule = {
  query: {
    max: 500,
    errorMessage: 'エンコード後の文字数が多すぎます',
  },
}

// 各パラメータのバリデーション処理
const search = [
  query('q').custom((value: string) => {
    // パーセントエンコードした際に、文字数が規定値を超えないか検証する
    // valueにはデコード済みの値が渡ってくるため、再度エンコードしてから検証を実施する
    const encodedValue = encodeQuery(value)
    if (encodedValue.length >= rule.query.max) {
      throw new Error(
        `${rule.query.errorMessage} ${encodedValue.length}/${rule.query.max}`,
      )
    }

    // bool値の返却を忘れないこと（意図しない動作となる可能性がある）
    return true
  }),
]

const validator = {
  search,
}

export { validator, rule }
