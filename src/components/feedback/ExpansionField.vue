<template>
  <v-row class="expansion-field">
    <v-col cols="12" class="text-center">
      <span class="button" @click="toggleOpen()">
        <slot name="button"></slot>
        <!-- Vuetifyのトランジョンには要素を回転させるものが存在しないため、独自に実装している -->
        <transition name="rotate" mode="out-in">
          <v-icon v-if="open" key="open">mdi-arrow-up-drop-circle</v-icon>
          <v-icon v-else key="close">mdi-arrow-down-drop-circle</v-icon>
        </transition>
      </span>
    </v-col>
    <v-expand-transition>
      <v-col v-if="open" cols="12" class="content">
        <slot name="content"></slot>
      </v-col>
    </v-expand-transition>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      open: false, // 内容の表示・非表示
    }
  },
  methods: {
    /**
     * 内容の表示・非表示を切り替える
     */
    toggleOpen() {
      this.open = !this.open
    },
  },
})
</script>

<style lang="scss" scoped>
.rotate-enter-active,
.rotate-leave-active {
  /** 初期状態ではディレイが遅い（開閉からワンテンポ遅れる）ため、開閉と同時になるように調整している */
  transition-delay: -1s;
}

.rotate-enter-active {
  rotate: 180deg;
}
</style>
