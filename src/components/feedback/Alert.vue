<template>
  <v-scale-transition v-if="alert" origin="center center">
    <v-alert :type="type" :timeout="timeout">
      {{ text }}
    </v-alert>
  </v-scale-transition>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { alertType, AlertType } from '~/preferences/alertType'

export default Vue.extend({
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<AlertType>,
      required: false,
      default: alertType.info,
    },
    timeout: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  computed: {
    alert: {
      get(): boolean {
        return this.show
      },
      set(value: boolean) {
        this.$emit('update:show', value)
      },
    },
  },
  mounted() {
    if (this.timeout > 0) {
      this.setTimeout(this.timeout)
    }
  },
  methods: {
    setTimeout(time: number) {
      window.setTimeout(() => {
        this.alert = false
      }, time)
    },
  },
})
</script>
