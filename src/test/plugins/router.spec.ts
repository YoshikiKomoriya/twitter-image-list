import { Context } from '@nuxt/types'
import router from '~/plugins/router'

describe('ページ遷移向けの拡張設定', () => {
  test('ページ遷移時、Google Analyticsに独自のイベントが発火される', () => {
    // 各種処理をモック化
    const mockLogEvent = jest.fn()
    const mockTo = {
      fullPath: '/keyword/検索キーワード',
    }
    const mockFrom = { matched: ['test'] }
    const mockContext = {
      app: {
        router: {
          afterEach: (fn: Function) => {
            fn(mockTo, mockFrom)
          },
        },
      },
      $fire: {
        analytics: {
          logEvent: mockLogEvent,
        },
      },
    } as unknown as Context

    // 処理の実行
    router(mockContext)

    // 検証
    expect(mockLogEvent).toBeCalled()
  })

  test('ページアクセス時に参照元情報がない（aタグ・直接のアクセスの想定）場合、追加の処理が実施されない', () => {
    // 各種処理をモック化
    const mockLogEvent = jest.fn()
    const mockTo = { fullPath: '/keyword/検索キーワード' }
    const mockFrom = { matched: [] }
    const mockContext = {
      app: {
        router: {
          afterEach: (fn: Function) => {
            fn(mockTo, mockFrom)
          },
        },
      },
      $fire: {
        analytics: {
          logEvent: mockLogEvent,
        },
      },
    } as unknown as Context

    // 処理の実行
    router(mockContext)

    // 検証
    expect(mockLogEvent).toBeCalledTimes(0)
  })
})
