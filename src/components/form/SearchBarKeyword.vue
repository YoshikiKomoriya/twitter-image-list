<template>
  <v-text-field
    v-model="keyword"
    :append-outer-icon="icon"
    :label="label"
    :rules="[rule.counter]"
    @click:append-outer="submit"
    @keydown.enter="submit"
  ></v-text-field>
</template>

<script lang="ts">
import Vue from 'vue'
import { encodeQuery } from '~/modules/query'
import { icon, labels, rules, pathPrefixes } from '~/preferences/searchBar'

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
      label: labels.keyword,
      icon,
      rule: {
        counter: rules.keyword.counter,
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
      this.$router.push(`/${pathPrefixes.keyword}/${encodedKeyword}`)
    },
  },
})
</script>
