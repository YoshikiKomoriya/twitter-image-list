<template>
  <v-row>
    <v-col cols="12">
      <span>{{ text }}</span>
    </v-col>
    <v-col cols="auto">
      <a :href="progileImageUrl" target="_blank" rel="noopener noreferrer">
        <v-avatar max-width="2rem">
          <v-img :src="user.profile_image_url_https"></v-img>
        </v-avatar>
      </a>
    </v-col>
    <v-col>
      <a :href="profilePageUrl" target="_blank" rel="noopener noreferrer">
        <span>{{ user.name }}</span>
        <br />
        <span>@{{ user.screen_name }}</span>
      </a>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { pathPrefixes } from '~/preferences/searchBar'
import { getOriginalProfileImageUrl } from '~/preferences/tweetUser'
import { User } from '~openapi/generated/src'

export default Vue.extend({
  props: {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  computed: {
    /**
     * プロフィール画像のオリジナル画質のURL
     */
    progileImageUrl: {
      get(): string {
        return getOriginalProfileImageUrl(this.user.profile_image_url_https)
      },
    },
    /**
     * 該当ユーザーのユーザー検索ページのURL
     */
    profilePageUrl: {
      get(): string {
        return `/${pathPrefixes.user}/${this.user.screen_name}`
      },
    },
  },
})
</script>

<style lang="scss" scoped>
// ユーザー情報を表示するaタグについて、通常の文字列と同じ見た目になるよう下線の表示を制御する
a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
