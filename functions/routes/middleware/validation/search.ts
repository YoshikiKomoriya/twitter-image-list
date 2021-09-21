import { query } from 'express-validator'
import { encodeQuery } from '~/routes/bin/query'

// 各パラメータの数値や文字列の条件
const rule = {
  query: {
    max: 500,
    errorMessage: 'エンコード後の文字列が多すぎます',
  },
  count: {
    min: 1,
    max: 100,
    default: 15,
  },
}

// 各パラメータのバリデーション処理
const search = [
  query('q')
    .isString()
    .notEmpty()
    .custom((value) => {
      const encodedValue = encodeQuery(value)
      if (encodedValue.length >= rule.query.max) {
        throw new Error(
          `${rule.query.errorMessage} ${encodedValue.length}/${rule.query.max}`,
        )
      }

      // bool値の返却を忘れないこと（意図しない動作となる可能性がある）
      return true
    }),
  query('count')
    .isInt({ min: rule.count.min, max: rule.count.max })
    .default(rule.count.default)
    .optional(),
  query('max_id').isString().optional(),
]

const validator = {
  search,
}

export { validator, rule }
