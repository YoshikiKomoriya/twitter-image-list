import { convertPlusToSpace, encodeQuery, getParameter } from '~/modules/query'

// テストで使用する関数の定義
/**
 * 指定の文字列をエンコードする
 * （encodeURIComponent()と独自の置換処理を用いた方式）
 * @param string 文字列
 * @returns エンコード後の文字列
 */
const encodeString = (string: string) => {
  const encodedString = encodeURIComponent(string)

  // encodeURIComponent()ではエンコードされない文字を独自にエンコードする
  /**
   * encodeURIComponent()は、最新の仕様であるRFC 3986の仕様に一部対応していない
   * （RFC 2396に準拠している様子？）
   * RFC 3986の仕様に沿う場合、追加のエンコード処理が必要となる
   *
   * @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#description
   */
  const extraEncodedString = encodedString.replace(/[!~'() ]/g, (c) => {
    // 他の記述は大文字であるため、toUpperCase()を用いて統一する
    /**
     * *パーセントエンコーディングを行っている文字*は、仕様上大文字/小文字の区別を行わない
     * （URLを構成する他の要素では、大文字/小文字を区別する部分もあるため注意すること）
     * また、大文字に正規化することが推奨されている
     *
     * @see https://datatracker.ietf.org/doc/html/rfc3986#section-6.2.2.1
     * > For all URIs, the hexadecimal digits within a percent-encoding
     * > triplet (e.g., "%3a" versus "%3A") are case-insensitive and therefore
     * >should be normalized to use uppercase letters for the digits A-F.
     */
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })

  // encodeURIComponent()はスペースを'%20'にエンコードするため、仕様に沿うよう'+'に置換する
  const spaceEncodedString = extraEncodedString.replaceAll('%20', '+')

  return spaceEncodedString
}

describe('クエリ文字に関する処理', () => {
  // 別のエンコード処理と結果を突き合わせる形で、処理の内容が正しいかどうかを検証している
  test('文字列のURIエンコード', () => {
    // テストデータの構成およびエンコード仕様の定義
    /**
     * エンコード対象となる文字の仕様は若干複雑なものになっている
     * 調べた限りだと、以下のような仕様になっているらしい…
     * - `A-Z` `a-z` `0-9` `*-._` はそのまま残す
     * - スペースは`+`に置換する
     * - その他の文字列はパーセントエンコードを実施する
     *
     * @see https://datatracker.ietf.org/doc/html/rfc3986#section-2.2
     * @see https://url.spec.whatwg.org/#application/x-www-form-urlencoded
     * @see https://qiita.com/shibukawa/items/c0730092371c0e243f62
     * @see https://qiita.com/aosho235/items/0581fc82f8ce2c5ac055
     * @see https://qiita.com/sisisin/items/3efeb9420cf77a48135d
     */
    const japanese = 'テスト用の文字列' // 日本語
    const reversed = "!~'()" // エンコードを行う記号（一部を抜粋）
    const unreserved = '*-._' // エンコードを行わない記号
    const space = ' +' // スペースは+にエンコードされる

    // 使用するテストデータ
    const string = japanese + reversed + unreserved + space

    expect(encodeQuery(string)).toBe(encodeString(string))
  })

  test(`'+'の文字列をスペースに置換する`, () => {
    const string = 'hoge+fuga'
    const convertedString = 'hoge fuga'

    expect(convertPlusToSpace(string)).toBe(convertedString)
  })

  test('クエリ文字から指定のパラメータを取得する', () => {
    const parameters = [
      ['foo', 'bar'],
      ['hoge', 'fuga'],
    ]
    const query = new URLSearchParams(parameters).toString()

    expect(getParameter(query, 'foo')).toBe(parameters[0][1])
    expect(getParameter(query, 'hoge')).toBe(parameters[1][1])
  })
})
