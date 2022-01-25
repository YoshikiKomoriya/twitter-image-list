<template>
  <v-row align="center" justify="center" justify-md="start">
    <template v-for="status in statuses">
      <!-- メディアは同じものが'複数のツイートで使い回される'&'単一ツイート内で複数回添付される'様子なので、複数のIDを組み合わせることでキーを一意に設定している -->
      <v-col
        v-for="(media, index) in status.extended_entities.media"
        :key="`${status.id}-${media.id}-${index}`"
        cols="6"
        md="3"
      >
        <tweet-card-image
          v-if="isPhoto(media.type)"
          :status="status"
          :media="media"
        ></tweet-card-image>
        <tweet-card-video
          v-else
          :status="status"
          :media="media"
        ></tweet-card-video>
      </v-col>
    </template>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import TweetCardImage from '~/components/display/TweetCardImage.vue'
import TweetCardVideo from '~/components/display/TweetCardVideo.vue'
import { isPhoto } from '~/preferences/mediaType'
import { Tweet } from '~openapi/generated/src'

export default Vue.extend({
  components: {
    TweetCardImage,
    TweetCardVideo,
  },
  props: {
    statuses: {
      type: Array as PropType<Tweet[]>,
      required: true,
    },
  },
  methods: {
    /**
     * ツイートのメディアが画像であるかどうかを判定する
     */
    isPhoto(type: string) {
      return isPhoto(type)
    },
  },
})
</script>
