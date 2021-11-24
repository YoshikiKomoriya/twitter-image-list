<template>
  <article>
    <v-row>
      <v-col>
        <h1 class="text-center">{{ keyword }} の検索結果</h1>
        <search-bar-keyword :value="keyword"></search-bar-keyword>
      </v-col>
    </v-row>
    <v-row v-show="existsStatus" justify="center" class="mb-5">
      <v-col cols="auto">
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
      :keyword="keyword"
    ></request-api-button>
  </article>
</template>

<script lang="ts">
import Vue from 'vue'
import TweetMediaDownloadButton from '~/components/display/TweetMediaDownloadButton.vue'
import TweetWrapper from '~/components/display/TweetWrapper.vue'
import SearchBarKeyword from '~/components/form/SearchBarKeyword.vue'
import RequestApiButton from '~/components/page/keyword/RequestApiButton.vue'
import { convertPlusToSpace } from '~/modules/query'
import { Tweet } from '~openapi/generated/src'

export default Vue.extend({
  components: {
    SearchBarKeyword,
    TweetWrapper,
    TweetMediaDownloadButton,
    RequestApiButton,
  },
  data() {
    const keyword = convertPlusToSpace(this.$route.params.keyword)
    const statuses: Tweet[] = []

    return { keyword, statuses }
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
