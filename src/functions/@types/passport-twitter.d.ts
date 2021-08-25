/**
 * ライブラリ'passport-twitter'の定義ファイルを拡張したもの
 */
import { Request } from 'express'
import { Profile } from 'passport-twitter'

declare module 'passport-twitter' {
  /**
   * TwitterStrategyクラスのコンストラクタにおける第2引数の関数
   * 型定義が作成されていないため、独自に作成している
   */
  type Verify = (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ) => void
}
