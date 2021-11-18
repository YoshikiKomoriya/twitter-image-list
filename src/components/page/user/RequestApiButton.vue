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
import ButtonPrimary from '~/components/general/ButtonPrimary.vue'
import CardAlert from '~/components/feedback/CardAlert.vue'
import {
  StatusesApi,
  StatusesUserTimelineRequest,
  Tweet,
} from '~openapi/generated/src'
import { alertType } from '~/preferences/alertType'
import { filterTweetsToExistMedia } from '~/modules/mediaFilter'
import { getFromStatusCode } from '~/modules/errorMessage'

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
    screenName: {
      type: String,
      required: true,
    },
  },
  data() {
    const requestParameter: StatusesUserTimelineRequest = {
      screen_name: this.screenName,
      count: 200,
      include_rts: false,
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
     * タイムライン取得APIのリクエストを実行する
     */
    async request() {
      const api = new StatusesApi()

      let response: Tweet[]

      try {
        response = await api.statusesUserTimeline(this.requestParameter)
      } catch (reason) {
        // エラーが発生した場合、アラートに表示する
        return this.errorHandler(reason)
      }

      // メディア情報が存在するツイートのみ保持する
      // 一部のツイートにはメディアに関する情報が含まれておらず、メディアのURLを割り出せないため、表示の対象としない
      const statuses = filterTweetsToExistMedia(response)

      this.concat(statuses)
      this.checkNextResult(response)
    },
    /**
     * タイムライン取得APIのツイート群を既存データと結合する
     */
    concat(statuses: Tweet[]) {
      this.$emit('update:statuses', this.statuses.concat(statuses))
    },
    /**
     * タイムライン取得APIの結果をもとに、コンポーネントのデータを更新する
     */
    checkNextResult(tweets: Tweet[]) {
      if (tweets.length === 0) {
        this.moreLoadButton.show = false
        return
      }

      const lastTweet = tweets.pop()
      if (lastTweet === undefined) {
        this.moreLoadButton.show = false
        return
      }

      const maxId = BigInt(lastTweet.id_str) - 1n // IDの値はNumber型で扱える数値を超えることがあるため（lastTweet.idも数値が丸め込まれている）、生成・減算共にBigIntを利用している
      this.requestParameter.max_id = maxId.toString()
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
