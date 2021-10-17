<template>
  <tweet-card>
    <template #content>
      <video-player :src="variants.lowest.url">
        <!-- 読み込み中に表示するアニメーション -->
        <template #placeholder>
          <v-row justify="center" align="center" class="fill-height">
            <v-progress-circular indeterminate></v-progress-circular>
          </v-row>
        </template>
      </video-player>

      <v-btn icon absolute top right @click="toggleShow()">
        <v-icon>mdi-information</v-icon>
      </v-btn>

      <!-- インフォメーションボタンクリック時に展開されるツイート情報 -->
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
          :media-href="variants.highest.url"
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
import VideoPlayer from '~/components/general/VideoPlayer.vue'
import { Media, Tweet } from '~openapi/generated/src'
import { selectHighestAndLowest } from '~/modules/videoVariant'

export default Vue.extend({
  components: { TweetCard, TweetCardText, TweetCardActions, VideoPlayer },
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
    const show = false

    // 表示用（最低画質）・ダウンロード用（最高画質）のビデオ情報を抽出する
    if (this.media.video_info === undefined) {
      throw new TypeError('ツイートに動画情報が含まれていません')
    }
    const variants = selectHighestAndLowest(this.media.video_info.variants)

    return { show, variants }
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
