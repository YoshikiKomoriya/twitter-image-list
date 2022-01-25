<template>
  <v-btn
    color="primary"
    depressed
    :x-small="isXSmall"
    :small="isSmall"
    :large="isLarge"
    :x-large="isXLarge"
    :block="block"
    :loading="loading"
    @click="clickEvent"
  >
    <v-icon
      :x-small="isXSmall"
      :small="isSmall"
      :large="isLarge"
      :x-large="isXLarge"
      ><slot name="icon"></slot
    ></v-icon>
    <span><slot name="text"></slot></span>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { buttonSize, ButtonSizeType } from '~/preferences/buttonSize'

export default Vue.extend({
  props: {
    /**
     * ボタンのサイズ
     */
    size: {
      default: 'normal',
      type: String as PropType<ButtonSizeType>,
      required: false,
    },
    /**
     * ボタンをブロック全体に広げるか否か
     */
    block: {
      default: false,
      type: Boolean,
      required: false,
    },
    /**
     * ローディング表示
     */
    loading: {
      default: false,
      type: Boolean,
      required: false,
    },
  },
  computed: {
    isXSmall() {
      return this.size === buttonSize.xSmall
    },
    isSmall() {
      return this.size === buttonSize.small
    },
    isLarge() {
      return this.size === buttonSize.large
    },
    isXLarge() {
      return this.size === buttonSize.xLarge
    },
  },
  methods: {
    /**
     * ボタンクリック時に実行される関数
     * 親コンポーネントにイベントを発生させる
     */
    clickEvent(value: boolean) {
      this.$emit('input', value)
    },
  },
})
</script>
