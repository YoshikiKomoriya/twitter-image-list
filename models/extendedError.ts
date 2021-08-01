/**
 * ユーザー定義例外をまとめたファイル
 * 抱えるクラスが増えてきた場合、必要に応じてディレクトリ・ファイルを分割する
 */

/**
 * ユーザー定義例外向けの継承元クラス
 * 以下の拡張を行っている
 * - nameプロパティが該当クラスのものになるように初期化設定を追加
 *   - Errorクラスを継承するだけでは、nameプロパティは'Error'のままである様子
 *     - @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
 *     - @see https://qiita.com/shibukawa/items/ffe7264ecff78f55b296#%E7%AC%AC%E4%B8%80%E6%A1%88%E5%A4%B1%E6%95%97
 */
class ExtendedError extends Error {
  constructor(e?: string) {
    // 継承元クラス（Error）の初期化処理を実行する
    super(e)

    // nameプロパティが継承元のものを引き継いでしまうため、インスタンス化の際に指定されたもの（ExtendedError）に上書きする
    Object.defineProperty(this, 'name', {
      value: this.constructor.name,
      // 上書きが可能（規定値ではない設定）
      writable: true,
      // プロパティ列挙（for...in等）に出現させない（規定値だが、設定内容が一度に理解できるよう明示的に表記する）
      enumerable: false,
      // 属性の変更が可能（規定値ではない設定）
      configurable: true,
    })
  }
}

/**
 * 検証の結果が無効なものである場合に発生する例外
 */
class ValidationError extends ExtendedError {}

export { ExtendedError, ValidationError }
