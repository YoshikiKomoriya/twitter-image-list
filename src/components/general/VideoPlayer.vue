<template>
  <v-responsive aspect-ratio="1">
    <slot v-if="canPlay === false" name="placeholder"></slot>
    <v-lazy>
      <video
        :src="src"
        controls
        :class="videoDisplay"
        @canplay="canPlay = true"
      >
        {{ alt }}
      </video>
    </v-lazy>
  </v-responsive>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default:
        'このブラウザは動画に対応していません。対応ブラウザでご利用ください。',
      required: false,
    },
  },
  data() {
    return {
      canPlay: false,
    }
  },
  computed: {
    videoDisplay: {
      get(): string {
        return this.canPlay ? '' : 'd-none'
      },
    },
  },
})
</script>

<style lang="scss" scoped>
video {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
