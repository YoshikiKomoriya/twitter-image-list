module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    '@nuxtjs/eslint-config-typescript',
    'prettier',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    // eslint-plugin-importを用いて、モジュールのimport順を制御する
    'import/order': [
      'warn',
      {
        alphabetize: { order: 'asc' },
      },
    ],
  },
  overrides: [
    // Nuxtの設定とVueスタイルガイドのルールで競合が発生するため、該当のディレクトリ配下でルールを無効にする
    {
      files: ['nuxt/src/pages/**/*.vue', 'nuxt/src/layouts/**/*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
  ],
}
