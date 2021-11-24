<template>
  <v-dialog
    v-model="dialog"
    @click:outside="
      toggleDialog()
      cancel()
    "
  >
    <template #activator="{ on }">
      <v-btn
        color="primary"
        @click="
          toggleDialog()
          download()
        "
        v-on="on"
      >
        ダウンロード
      </v-btn>
    </template>

    <v-card>
      <v-card-title> メディアのダウンロード </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <progress-linear :counter="process.counter"></progress-linear>
          </v-col>
          <v-expand-transition>
            <v-col v-show="errors.length > 0" cols="12">
              <tweet-media-download-alert
                :errors="errors"
              ></tweet-media-download-alert>
            </v-col>
          </v-expand-transition>
        </v-row>
        <v-row justify="center">
          <v-col cols="auto">
            <v-btn
              color="primary"
              large
              :href="file.objectUrl"
              :download="`${file.name}.zip`"
              :loading="process.processing"
            >
              ダウンロード
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="process.processing" @click="cancel()"> キャンセル </v-btn>
        <v-btn v-else @click="toggleDialog()"> 閉じる </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import TweetMediaDownloadAlert from '~/components/display/TweetMediaDownloadAlert.vue'
import ProgressLinear from '~/components/feedback/ProgressLinear.vue'
import { MediaDownloadError } from '~/modules/customError'
import { MediaDownloader, ProcessCounter } from '~/modules/mediaDownloader'
import { mapMediasByTweets } from '~/modules/mediaFilter'
import { FileInformation, MediaZipGenerator } from '~/modules/mediaZipGenerator'
import { Media, Tweet } from '~openapi/generated/src'

export default Vue.extend({
  components: { ProgressLinear, TweetMediaDownloadAlert },
  props: {
    statuses: {
      type: Array as PropType<Tweet[]>,
      required: true,
    },
  },
  data() {
    const dialog = false // ダイアログの表示・非表示

    // ダウンロード用ZIPファイルの情報
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

    // エラーをまとめて表示するため、配列に格納する
    const errors: MediaDownloadError[] = []

    // ダウンロード用クラスはコンポーネント内でグローバルなオブジェクトとして扱いたいため、データ内であらかじめ定義する
    const downloader = new MediaDownloader()

    return { dialog, file, process, errors, downloader }
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

      await this.downloadMedia()
      await this.generateZipFile()

      this.process.processing = false
    },
    /**
     * メディアのダウンロード処理を実施する
     */
    async downloadMedia() {
      this.downloader.setMedias(this.medias)
      await this.downloader.download(this.process.counter)

      // エラーが発生している場合、記録する
      if (this.downloader.errors.length > 0) {
        this.recordErrors(this.downloader.errors)
      }
    },
    /**
     * ダウンロード用のZIPファイルを生成する
     */
    async generateZipFile() {
      const generator = new MediaZipGenerator(this.downloader.contents)
      try {
        await generator.generate()
        this.file = generator.file
      } catch (error) {
        // 想定されうるエラーかそうでないかによって、エラー文言を変更する
        if (error instanceof MediaDownloadError) {
          this.recordError(error)
        } else {
          this.recordError(
            new MediaDownloadError({
              message: '想定外のエラーが発生しました',
              data: error,
            }),
          )
        }

        // エラーが発生した場合、ダウンロードが不可能（ZIPファイルが生成できない）と想定されるため、キャンセル処理を実施する
        this.cancel()
      }
    },
    /**
     * モーダルの表示・非表示を切り替える
     */
    toggleDialog() {
      this.errors = [] // エラー表示の初期化
      this.dialog = !this.dialog
    },
    /**
     * キャンセル処理を行う
     */
    cancel() {
      this.downloader.reset()
      window.URL.revokeObjectURL(this.file.objectUrl)
      this.process.processing = false
    },
    /**
     * メディアダウンロードに関するエラーハンドリング
     * エラー情報を記録する
     */
    recordError(error: MediaDownloadError) {
      this.errors.push(error)
    },
    /**
     * メディアダウンロードに関するエラーハンドリング
     * 複数のエラー情報を記録する
     */
    recordErrors(errors: MediaDownloadError[]) {
      this.errors.push(...errors)
    },
  },
})
</script>
