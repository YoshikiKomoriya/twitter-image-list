<template>
  <v-dialog v-model="dialog" @click:outside="cancel">
    <template #activator="{ on }">
      <v-btn @click="download" v-on="on"> ダウンロード </v-btn>
    </template>

    <v-card>
      <v-card-title> メディアのダウンロード </v-card-title>
      <v-card-text>
        <progress-linear :counter="process.counter"></progress-linear>
        <tweet-media-download-alert
          :errors="downloader.errors"
        ></tweet-media-download-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="cancel">キャンセル</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :href="file.objectUrl"
          :download="`${file.name}.zip`"
          :loading="process.processing"
        >
          ダウンロード
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import TweetMediaDownloadAlert from '~/components/display/TweetMediaDownloadAlert.vue'
import ProgressLinear from '~/components/feedback/ProgressLinear.vue'
import { Media, Tweet } from '~openapi/generated/src'
import { FileInformation, MediaZipGenerator } from '~/modules/mediaZipGenerator'
import { MediaDownloader, ProcessCounter } from '~/modules/mediaDownloader'
import { mapMediasByTweets } from '~/modules/mediaFilter'
import { MediaDownloadError } from '~/modules/customError'

export default Vue.extend({
  components: { ProgressLinear, TweetMediaDownloadAlert },
  props: {
    statuses: {
      type: Array as PropType<Tweet[]>,
      required: true,
    },
  },
  data() {
    const dialog = false
    const file: FileInformation = {
      objectUrl: '',
      name: 'medias',
    }

    // 進捗状況を記録する&表示の制御を行う
    const process: { processing: boolean; counter: ProcessCounter } = {
      processing: true,
      counter: {
        processed: 0,
        total: 0,
      },
    }

    // ダウンロード用クラスはコンポーネント内でグローバルなオブジェクトとして扱いたいため、データ内であらかじめ定義する
    const downloader: {
      instance: MediaDownloader
      errors: MediaDownloadError[]
    } = {
      instance: new MediaDownloader([]),
      errors: [], // エラーをまとめて表示するため、配列に格納する
    }

    return { dialog, file, process, downloader }
  },
  computed: {
    /**
     * ダウンロード対象となるメディアの一覧
     */
    medias: {
      get(): Media[] {
        // 表示の際に扱いやすいように、1次配列化&メディア情報のみ抽出する
        return mapMediasByTweets(this.statuses)
      },
    },
  },
  /**
   * ダウンロードが進行中の可能性があるため、コンポーネントの破棄前にキャンセル処理を行う
   */
  beforeDestroy() {
    this.cancel()
  },
  methods: {
    /**
     * ダウンロードボタンが押された際の処理
     */
    async download() {
      this.process.processing = true
      this.toggleDialog()

      await this.downloadMedia()
      const generatedFile = await this.generateZipFile()
      this.file = generatedFile.file

      this.process.processing = false
    },
    /**
     * メディアのダウンロード処理を実施する
     */
    async downloadMedia() {
      // 初期化処理（メディア一覧の設定）が必要になるため、クラスは毎回インスタンス化する
      this.downloader.instance = new MediaDownloader(this.medias)
      await this.downloader.instance
        .download(this.process.counter)
        .catch((reason: MediaDownloadError) => {
          this.errorHandler(reason)
        })
    },
    /**
     * ダウンロード用のZIPファイルを生成する
     */
    async generateZipFile() {
      const generator = new MediaZipGenerator(this.downloader.instance.contents)
      await generator.generate().catch((reason: MediaDownloadError) => {
        this.errorHandler(reason)
      })

      return generator
    },
    /**
     * モーダルの表示・非表示を切り替える
     */
    toggleDialog() {
      this.dialog = !this.dialog
    },
    /**
     * キャンセル処理を行う
     */
    cancel() {
      this.downloader.instance.abort()
      window.URL.revokeObjectURL(this.file.objectUrl)
      this.process.processing = false
      this.downloader.errors = []
    },
    /**
     * メディアダウンロードに関するエラーハンドリング
     */
    errorHandler(error: MediaDownloadError) {
      this.downloader.errors.push(error)
    },
  },
})
</script>
