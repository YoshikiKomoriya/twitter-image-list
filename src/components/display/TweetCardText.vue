<template>
  <v-row>
    <v-col cols="12">
      <span>{{ text }}</span>
    </v-col>
    <v-col cols="auto">
      <a :href="gerProfileImageUrl(user.profile_image_url_https)">
        <v-avatar max-width="2rem">
          <v-img :src="user.profile_image_url_https"></v-img>
        </v-avatar>
      </a>
    </v-col>
    <v-col>
      <a :href="`https://twitter.com/${user.screen_name}`">
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
import { User } from '~openapi/generated/src'
import { getOriginalProfileImageUrl } from '~/preferences/tweetUser'

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
  methods: {
    /**
     * アイコン画像のURLからオリジナル画像のURLを取得する
     */
    gerProfileImageUrl(url: string) {
      getOriginalProfileImageUrl(url)
    },
  },
})
</script>

<style lang="scss" scoped>
// ユーザー情報を表示するaタグについて、通常の文字列と同じ見た目になるよう制御する
a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
