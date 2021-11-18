<template>
  <article>
    <v-row>
      <v-col>
        <h1 class="text-center">{{ screenName }} の検索結果</h1>
        <search-bar-user :value="screenName"></search-bar-user>
      </v-col>
    </v-row>
    <v-row v-show="existsStatus">
      <v-col>
        <tweet-media-download-button
          :statuses="statuses"
        ></tweet-media-download-button>
      </v-col>
    </v-row>
    <section>
      <tweet-wrapper :statuses="statuses"></tweet-wrapper>
    </section>
    <request-api-button
      :statuses.sync="statuses"
      :screen-name="screenName"
    ></request-api-button>
  </article>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchBarUser from '~/components/form/SearchBarUser.vue'
import TweetWrapper from '~/components/display/TweetWrapper.vue'
import TweetMediaDownloadButton from '~/components/display/TweetMediaDownloadButton.vue'
import RequestApiButton from '~/components/page/user/RequestApiButton.vue'
import { Tweet } from '~openapi/generated/src'

export default Vue.extend({
  components: {
    SearchBarUser,
    TweetWrapper,
    TweetMediaDownloadButton,
    RequestApiButton,
  },
  data() {
    const screenName = this.$route.params.screen_name
    const statuses: Tweet[] = []

    return { screenName, statuses }
  },
  computed: {
    /**
     * ツイート群が存在するかどうか
     */
    existsStatus: {
      get(): boolean {
        return this.statuses.length > 0
      },
    },
  },
})
</script>
