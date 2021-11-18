<template>
  <v-text-field
    v-model="screenName"
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
      screenName: '',
      label: labels.user,
      icon,
      rule: {
        counter: rules.user.counter,
      },
    }
  },
  created() {
    this.screenName = this.value
  },
  methods: {
    /**
     * 送信時の処理
     * キーワードを引き継いで、キーワード検索画面へ遷移する
     */
    submit() {
      const encodedScreenName = encodeQuery(this.screenName)
      this.$router.push(`/${pathPrefixes.user}/${encodedScreenName}`)
    },
  },
})
</script>
