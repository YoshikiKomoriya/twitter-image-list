/**
 * クエリ文字列に関する処理
 */

import { searchCondition } from '~/models/searchCondition'

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

/**
 * '+'の文字列をスペースに置換する
 * decodeURIComponent()を使用している場合、'+'はスペースに置換されない
 * 文言の表示等で置換が必要な場合に使う
 * @param value 置換対象となる文字列
 * @returns 置換後の文字列
 */
const convertPlusToSpace = (value: string) => {
  return value.replaceAll('+', ' ')
}

/**
 * 検索キーワードに対して、アプリ向けの条件を指定する
 * 検索条件を以下に指定する
 * - 画像のみ
 * - リツイートを含まない
 * @param keyword 検索キーワード
 * @returns 検索条件を加えたキーワード
 */
const addSearchCondition = (keyword: string, ...condition: string[]) => {
  // 配列に検索キーワード・各条件を指定して、仕切り用の文字列で結合する
  const baseParameter = [keyword]
  const parameters = baseParameter.concat(condition)
  const query = parameters.join(searchCondition.separetor)

  return query
}

/**
 * クエリ文字列を解析して、指定のパラメータを取得する
 * @param query クエリ文字列
 * @param key 取得したいパラメータ
 * @returns 指定のパラメータの値
 * @returns 指定のパラメータが存在しない場合、undefinedを返却する
 */
const getParameter = (parameter: string, key: string) => {
  const parameterObject = new URLSearchParams(parameter)
  const gettedParameter = parameterObject.get(key)

  if (gettedParameter === null) {
    return undefined
  }

  return gettedParameter
}

export { encodeQuery, convertPlusToSpace, addSearchCondition, getParameter }
