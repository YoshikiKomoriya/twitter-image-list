import Boom from 'boom'
import {
  ErrorResponse,
  isIncludeErrorCode,
  generateBoomError,
} from '~/routes/bin/generateBoomError'

describe('Twitter APIのエラーハンドリング', () => {
  describe('エラーコードの記載の有無を判定する', () => {
    test('エラーオブジェクトに数値のエラーコードが存在する場合、エラーコードが存在すると判定される', () => {
      const error: ErrorResponse = {
        errors: [
          {
            code: 1,
            message: 'failed.',
          },
        ],
      }
      expect(isIncludeErrorCode(error)).toBe(true)
    })

    test('エラーオブジェクトが配列でない場合、エラーコードが存在しないと判定される', () => {
      const error = { errors: 'error.' }
      expect(isIncludeErrorCode(error)).toBe(false)
    })

    test('エラーオブジェクトのエラーコードが数値以外の場合、エラーコードが存在しないと判定される', () => {
      const error = {
        errors: [
          {
            code: '1',
            message: 'failed.',
          },
        ],
      }
      expect(isIncludeErrorCode(error)).toBe(false)
    })
  })

  describe('エラー形式に沿ったエラーを生成する', () => {
    test.each([
      [
        '指定のリソースが見つからない（34）',
        { code: 34, error: Boom.notFound('指定のリソースが見つかりません') },
      ],
      [
        'レート制限に達している（88）',
        { code: 88, error: Boom.tooManyRequests('レート制限に達しました') },
      ],
      [
        '想定外のエラー（34・88以外）',
        {
          code: 0,
          error: Boom.internal(
            '想定外のエラーが発生しました。エラーコードを参照してください',
          ),
        },
      ],
    ])(
      'エラーコードが記載されている場合、それに沿ったエラーが返却される（%p）',
      (_label, data) => {
        const error: ErrorResponse = {
          errors: [
            {
              code: data.code,
              message: 'failed.',
            },
          ],
        }

        const boomError = generateBoomError(error)

        expect(boomError.typeof).toBe(data.error.typeof)
        expect(boomError.message).toBe(data.error.message)
      },
    )

    test('エラーコードの記載がなく、認可されていない操作の場合、専用のエラーが返却される', () => {
      const error = { error: 'Not authorized.' }

      expect(generateBoomError(error)).toEqual(
        Boom.unauthorized('この操作には認可が必要です'),
      )
    })

    test('特定の形式に当てはまらない場合、汎用的なエラーが返却される', () => {
      const error = { error: 'failed.' }

      expect(generateBoomError(error)).toEqual(
        Boom.internal('Twitter APIの通信でエラーが発生しました', error),
      )
    })
  })
})
