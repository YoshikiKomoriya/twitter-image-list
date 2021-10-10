<template>
  <v-text-field
    v-model="keyword"
    append-outer-icon="mdi-magnify"
    label="検索キーワード"
    :rules="[rule.counter]"
    @click:append-outer="submit"
    @keydown.enter="submit"
  ></v-text-field>
</template>

<script lang="ts">
import Vue from 'vue'
import { encodeQuery } from '~/plugins/query'

export default Vue.extend({
  props: {
    value: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      keyword: '',
      rule: {
        counter: (value: string | undefined) => {
          // 0文字の場合はエラーを発生させない
          if (value === undefined) {
            return true
          }

          // API上では文字列の最大の長さは100文字としているため、そちらに準拠する
          const limit = 100
          if (value.length <= limit) {
            return true
          }

          return 'キーワードが長すぎます'
        },
      },
    }
  },
  created() {
    this.keyword = this.value
  },
  methods: {
    /**
     * 送信時の処理
     * キーワードを引き継いで、キーワード検索画面へ遷移する
     */
    submit() {
      const encodedKeyword = encodeQuery(this.keyword)
      this.$router.push(`/keyword/${encodedKeyword}`)
    },
  },
})
</script>

%E3%81%82
