/**
 * IDE向けに、vueファイルのimportを可能とする型設定を追加する
 * 'importしようとしているvueファイルの型がわからない'という旨のエラーが出るため、'Vueクラスである'と明示的に設定している
 */
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.md' {
  export default String
}
