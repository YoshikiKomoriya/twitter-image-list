/**
 * メニューに表示するリンク先一覧
 */
type Link = {
  readonly title: string
  readonly path: string
  readonly icon: string
}

/**
 * リンクに設定するページの情報
 */
const links: readonly Link[] = [
  {
    title: 'ホーム',
    path: '/',
    icon: 'mdi-home',
  },
  {
    title: 'ご利用上の注意',
    path: '/rule',
    icon: 'mdi-check',
  },
  {
    title: 'キーワード検索',
    path: '/keyword',
    icon: 'mdi-file-search',
  },
  {
    title: 'ユーザー検索',
    path: '/user',
    icon: 'mdi-account-search',
  },
]

export { links }
