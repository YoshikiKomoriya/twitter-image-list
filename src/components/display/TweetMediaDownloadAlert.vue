<template>
  <v-sheet>
    <card-alert :type="alertType.warning">
      <template #content>
        <p>ダウンロードに失敗したファイルがあります</p>
        <ul>
          <li v-for="(text, index) in texts" :key="index">
            {{ text }}
          </li>
        </ul>
      </template>
    </card-alert>
    <expansion-field>
      <template #button> エラー詳細を表示する </template>
      <template #content>
        <v-textarea :value="traces" filled></v-textarea>
      </template>
    </expansion-field>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import ExpansionField from '../feedback/ExpansionField.vue'
import CardAlert from '~/components/feedback/CardAlert.vue'
import { alertType } from '~/preferences/alertType'
import { MediaDownloadError } from '~/modules/customError'

export default Vue.extend({
  components: { CardAlert, ExpansionField },
  props: {
    /**
     * ダウンロード処理中に発生したエラーの一覧
     */
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
     * アラートの文言
     * propsで渡されたエラー情報をエラーメッセージごとにユニーク化する
     */
    texts: {
      get(): string[] {
        const texts = this.errors.map((error) => {
          return error.message
        })
        const uniqueTexts = [...new Set(texts)]

        return uniqueTexts
      },
    },
    /**
     * エラーの詳細
     * propsで渡されたエラー情報から詳細データを抽出して、文字列として展開する
     */
    traces: {
      get(): string {
        const filteredData = this.errors.filter((error) => {
          return error.data
        })
        const traces = filteredData.map((error) => {
          return JSON.stringify(error.data)
        })

        return traces.join('\n')
      },
    },
  },
})
</script>
