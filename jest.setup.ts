import { config, RouterLinkStub } from '@vue/test-utils'

/**
 * Nuxtの一部のモジュールは、Jestの標準機能で正常に読み込むことができない
 * 特定のモジュールについて、専用のモックを設定する
 */
config.stubs['nuxt-link'] = RouterLinkStub
config.stubs['no-ssr'] = { template: '<span><slot /></span>' }
