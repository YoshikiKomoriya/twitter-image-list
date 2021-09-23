<template>
  <button-primary :size="size" :block="block" @input="login">
    <template #icon>mdi-twitter</template>
    <template #text>Twitterでログイン</template>
  </button-primary>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import ButtonPrimary from '~/components/general/ButtonPrimary.vue'
import { ButtonSizeType } from '~/models/buttonSize'

export default Vue.extend({
  components: { ButtonPrimary },
  props: {
    size: {
      default: 'normal',
      type: String as PropType<ButtonSizeType>,
      required: false,
    },
    block: {
      default: false,
      type: Boolean,
      required: false,
    },
  },
  methods: {
    /**
     * ログイン向けの処理
     * APIサーバーの認証用エンドポイントにリダイレクトする
     */
    login() {
      window.location.href = `${this.$config.apiServerUrl}/authentication`
    },
  },
})
</script>
