/**
 * ページ遷移（vue-router）向けの拡張設定
 */

import { Context } from '@nuxt/types/app'
import { convertPlusToSpace } from '~/modules/query'

export default ({ app, $fire }: Context) => {
  // ページアクセス時の処理
  app.router?.afterEach((to, from) => {
    // ページ遷移の場合、Google Analyticsにイベントを発火する
    // vue-routerを使用したページ遷移はGoogle Analyticsに記録されない（aタグ or 直接のアクセスのみ）ため、独自にイベントを発火することで計測を可能にしている
    if (from.matched.length > 0) {
      /**
       * ページタイトルはデフォルトで`document.title`を取得するのだが、router.afterEach()の時点では遷移が完了していないため、遷移前のページタイトルが取得されてしまう
       * （router.onReady()内でも同様の様子…ページ遷移後にnuxtのhead()の処理が走るみたい？）
       * 暫定的に、遷移先ページのパスをタイトルに設定している
       * @todo タイトルの取得方法を検証して、正しいタイトルを設定する
       */
      const title = convertPlusToSpace(decodeURIComponent(to.fullPath)) // 見やすいようにデコード
      $fire.analytics.logEvent('page_view', { page_title: title })
    }
  })
}
