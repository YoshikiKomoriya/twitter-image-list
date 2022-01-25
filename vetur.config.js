// CommonJSの書式でないと設定を読みこまない様子なので、一時的に無視している
// eslint-disable-next-line no-undef
module.exports = {
  projects: [
    {
      root: './frontend',
      package: './package.json',
      tsconfig: './tsconfig.json',
    },
  ],
}
