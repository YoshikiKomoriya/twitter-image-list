# @types

独自の型定義ファイルを配置するディレクトリ
以下のような場合に、型定義ファイルを作成する

- ライブラリに型定義ファイルがない
- 既存の型定義ファイルを拡張する

## ファイル名について

`tsconfig.json`ファイルと同階層以下の`*.d.ts`であればファイル名に関係なく読み込まれる
ファイル名から内容を連想できるように、拡張元のモジュール名をそのままファイル名とする

## 型定義ファイルの反映方法

任意の型定義ファイルで、特定モジュールのアンビエント宣言を行う

例 : `hoge`モジュールの型定義を拡張する場合

```ts:hoge.d.ts
// アンビエント宣言時に、モジュール名を指定する
declare module 'hoge' {
  export function hogeFunction(): void

  interface HogeInterface {
    hoge: string
    huga: number
  }

  type HogeType1 = true | undefined
  type HogeType2 = (arg) => {} // 関数の型定義
}
```
