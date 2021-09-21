/**
 * クエリ文字列に関する処理
 */

/**
 * 特定の文字列に対してURIエンコードを行う
 * @param value エンコードしたい文字列
 * @returns エンコード後の文字列
 */
const encodeQuery = (value: string) => {
  /**
   * URLSearchParamsのtoString()メソッドは、パラメータをURLで利用可能な形にエンコードしてくれる
   * パラメータをひとつだけ追加した場合は、`${key}=${エンコード後のパラメータ}`の形式で文字列が作成される
   * これを利用して、文字列の生成後にキー情報の部分（`${key}=`）だけ削除することで、文字列のエンコードを実施している
   */
  const parameter = new URLSearchParams({ value })
  /**
   * replace()の第1引数に文字列を指定することで、**先頭から**マッチする文字列を探して**1度だけ**置換している（すべて置換したい場合は引数に正規表現を指定する）
   * 他の言語の文字列置換系関数ではあまり見られないJavaScript特有の動き方をするため、挙動に注意すること
   */
  const encodedValue = parameter.toString().replace('value=', '')
  return encodedValue
}

export { encodeQuery }
