<template>
  <alert :show="alertShow" :text="alertText" :type="alertType.error"></alert>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import alert from '~/components/feedback/Alert.vue'
import { alertType } from '~/preferences/alertType'
import { MediaDownloadError } from '~/modules/customError'

export default Vue.extend({
  components: { alert },
  props: {
    errors: {
      type: Array as PropType<MediaDownloadError[]>,
      required: true,
    },
  },
  data() {
    return { alertType }
  },
  computed: {
    /**
     * アラートの表示・非表示フラグ
     */
    alertShow: {
      get(): boolean {
        return this.errors.length > 0
      },
    },
    /**
     * アラートの文言
     * propsで渡されたエラー情報をすべて文字列として展開する
     */
    alertText: {
      get(): string {
        const errorMessages = this.errors.map((error) => {
          const data = error.data ? JSON.stringify(error.data) : undefined
          const text = data ? `${error.message} : ${data}` : `${error.message}`

          return text
        })

        return errorMessages.join('\n')
      },
    },
  },
})
</script>
