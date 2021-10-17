<template>
  <tweet-card>
    <template #content>
      <v-img
        :src="media.media_url_https + '?name=small'"
        contain
        :aspect-ratio="1"
        :alt="status.text"
        max-width="100vw"
        @click="toggleShow"
      >
        <!-- 読み込み中に表示するアニメーション -->
        <template #placeholder>
          <v-row justify="center" align="center" class="fill-height">
            <v-progress-circular indeterminate></v-progress-circular>
          </v-row>
        </template>
      </v-img>

      <!-- サムネイル画像クリック時に展開されるツイート情報 -->
      <v-expand-transition>
        <v-card-text v-show="show">
          <tweet-card-text
            :text="status.text"
            :user="status.user"
          ></tweet-card-text>
        </v-card-text>
      </v-expand-transition>

      <v-card-actions>
        <tweet-card-actions
          :media-href="originalImageUrl"
          :tweet-href="media.expanded_url"
        ></tweet-card-actions>
      </v-card-actions>
    </template>
  </tweet-card>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import TweetCard from '~/components/display/TweetCard.vue'
import TweetCardText from '~/components/display/TweetCardText.vue'
import TweetCardActions from '~/components/display/TweetCardActions.vue'
import { Media, Tweet } from '~openapi/generated/src'
import { addParameter } from '~/modules/query'
import { originalImageUrlParameter } from '~/preferences/mediaDownload'

export default Vue.extend({
  components: { TweetCard, TweetCardText, TweetCardActions },
  props: {
    media: {
      type: Object as PropType<Media>,
      required: true,
    },
    status: {
      type: Object as PropType<Tweet>,
      required: true,
    },
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    /**
     * メディアのオリジナル画像
     * URLに専用パラメータを付与することで、アクセスが可能となる
     */
    originalImageUrl: {
      get(): string {
        return addParameter(
          this.media.media_url_https,
          originalImageUrlParameter,
        )
      },
    },
  },
  methods: {
    /**
     * 本文情報の表示・非表示を切り替える
     */
    toggleShow() {
      this.show = !this.show
    },
  },
})
</script>
