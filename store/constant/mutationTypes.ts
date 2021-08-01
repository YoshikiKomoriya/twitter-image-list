/**
 * ミューテーションで頻繁に使用する関数に向けて、関数名に利用できる定数を提供する
 * ミューテーションとアクション間で関数名の重複が起こりやすいため、それを防止する目的である
 *
 * @see https://vuex.vuejs.org/ja/guide/mutations.html#ミューテーション・タイプに定数を使用する
 */

export const ADD_MUTATION = 'ADD_MUTATION'
export const SELECT_MUTATION = 'SELECT_MUTATION'
export const DELETE_MUTATION = 'DELETE_MUTATION'
export const RESET_MUTATION = 'RESET_MUTATION'
