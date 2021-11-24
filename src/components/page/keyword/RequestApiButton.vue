<template>
  <v-row>
    <v-col cols="12" class="text-center">
      <card-alert v-if="alert.show" :type="alert.type">
        <template #content>
          {{ alert.text }}
        </template>
      </card-alert>
      <button-primary
        v-if="moreLoadButton.show"
        block
        :loading="moreLoadButton.loading"
        @input="$fetch"
      >
        <template #icom>
          <v-icon>mdi-home</v-icon>
        </template>
        <template #text>もっと読み込む</template>
      </button-primary>
      <p v-else>検索結果は以上です</p>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import CardAlert from '~/components/feedback/CardAlert.vue'
import ButtonPrimary from '~/components/general/ButtonPrimary.vue'
import { getFromStatusCode } from '~/modules/errorMessage'
import { filterTweetsToExistMedia } from '~/modules/mediaFilter'
import { getParameter } from '~/modules/query'
import { alertType } from '~/preferences/alertType'
import {
  searchCondition,
  addSearchCondition,
} from '~/preferences/searchCondition'
import {
  ResponseSearchTweets,
  SearchApi,
  SearchMetadata,
  SearchTweetRequest,
  Tweet,
} from '~openapi/generated/src'

/**
 * キーワード検索で使うAPIリクエスト用のボタン
 * ユーザー検索やアカウントサービスでも利用されることが考えられるため、必要に応じて共通化を行う可能性あり
 * @todo 他機能と共通の処理群について、共通化を検討する
 */
export default Vue.extend({
  components: {
    ButtonPrimary,
    CardAlert,
  },
  props: {
    statuses: {
      type: Array as PropType<Tweet[]>,
      required: true,
    },
    keyword: {
      type: String,
      required: true,
    },
  },
  data() {
    const requestParameter: SearchTweetRequest = {
      q: addSearchCondition(
        this.keyword,
        searchCondition.exclude.retweets,
        searchCondition.filter.media,
      ),
      count: 100,
    }
    const moreLoadButton = {
      show: true,
      loading: true,
    }
    const alert = {
      show: false,
      text: '読み込みに失敗しました',
      type: alertType.error,
    }

    return { requestParameter, moreLoadButton, alert }
  },
  /**
   * コンポーネントのマウント後にAPIを呼び出す
   */
  async fetch() {
    await this.loadRequest()
  },
  /**
   * サーバーサイドレンダリングでデータを取得するとstatusesが更新されていない？様子なので、暫定的にクライアントオンリーに設定している
   * @todo 検証して原因を解明させる
   */
  fetchOnServer: false,
  methods: {
    /**
     * 検索処理を実施する
     */
    async loadRequest() {
      this.moreLoadButton.loading = true
      await this.request()
      this.moreLoadButton.loading = false
    },
    /**
     * 検索APIのリクエストを実行する
     */
    async request() {
      const api = new SearchApi()

      let response: ResponseSearchTweets

      try {
        response = await api.searchTweet(this.requestParameter)
      } catch (reason) {
        // エラーが発生した場合、アラートに表示する
        return this.errorHandler(reason)
      }

      // メディア情報が存在するツイートのみ保持する
      // 一部のツイートにはメディアに関する情報が含まれておらず、メディアのURLを割り出せないため、表示の対象としない
      const statuses = filterTweetsToExistMedia(response.statuses)

      this.concat(statuses)
      this.checkNextResult(response.search_metadata)
    },
    /**
     * 検索APIのツイート群を既存データと結合する
     */
    concat(statuses: Tweet[]) {
      this.$emit('update:statuses', this.statuses.concat(statuses))
    },
    /**
     * 検索APIの結果をもとに、コンポーネントのデータを更新する
     */
    checkNextResult(metadata: SearchMetadata) {
      if (metadata.next_results === undefined) {
        this.moreLoadButton.show = false
        return
      }

      const nextResults = decodeURIComponent(metadata.next_results)
      this.requestParameter.max_id = getParameter(nextResults, 'max_id')
    },
    /**
     * API通信のエラーハンドリングを行う
     */
    errorHandler(error: any) {
      this.alert.text = getFromStatusCode(error.status)
      this.alert.show = true
      this.moreLoadButton.show = false
    },
  },
})
</script>
