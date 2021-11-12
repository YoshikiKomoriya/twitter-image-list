<template>
  <v-alert :type="type" border="left" dense colored-border elevation="2">
    <span class="text-break"><slot name="content"></slot></span>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { alertType, AlertType } from '~/preferences/alertType'

export default Vue.extend({
  props: {
    /**
     * アラートに適用するスタイルの種別
     */
    type: {
      type: String as PropType<AlertType>,
      required: false,
      default: alertType.info,
    },
  },
})
</script>
