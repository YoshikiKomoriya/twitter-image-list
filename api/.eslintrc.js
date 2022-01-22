module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'prettier'],
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
}
