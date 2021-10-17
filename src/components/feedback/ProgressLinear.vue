<template>
  <v-progress-linear :value="progress" height="25">
    <template #default="{ value }"> {{ value }} % </template>
  </v-progress-linear>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { ProcessCounter } from '~/modules/mediaDownloader'

export default Vue.extend({
  props: {
    counter: {
      type: Object as PropType<ProcessCounter>,
      required: true,
    },
  },
  computed: {
    progress: {
      get(): number {
        const count = this.counter.processed / this.counter.total
        const percent = count * 100

        return Math.ceil(percent)
      },
    },
  },
})
</script>
