/**
 * メディアのダウンロード用ZIPファイルに関するクラス
 */

import JSZip from 'jszip'
import { MediaDownloadError } from '~/modules/customError'
import { Content } from '~/modules/mediaDownloader'

/**
 * メディアのダウンロード向けに生成されたZIPファイルの情報
 */
type FileInformation = {
  objectUrl: string
  name: string
}

/**
 * メディアのダウンロード用ZIPファイルに関するクラス
 */
class MediaZipGenerator {
  /**
   * ZIPファイルの設定
   */
  private _file: FileInformation = {
    objectUrl: '',
    name: 'media',
  }

  /**
   * ZIPファイルに格納するメディアファイルの一覧
   */
  private readonly _contents: Content[]

  /**
   * コンストラクタ
   * ZIPファイルにまとめるメディアファイルを決定する
   * @param contents メディアの実態の一覧
   */
  constructor(contents: Content[]) {
    this._contents = contents
  }

  /**
   * ZIPファイルのURLを生成する
   */
  async generate() {
    // ZIPファイルの作成
    const zipBlob = await this._generateZipBlob(this._contents, this._file.name)
    this._file.objectUrl = this._generateObjectUrl(zipBlob)
  }

  /**
   * メディアのコンテンツ情報（blob）から、ZIPファイルのデータ（blob）を作成する
   * @param contents コンテンツ情報
   * @param name ZIPファイル名
   * @returns ZIPファイルのデータ
   * @throws {@link MediaDownloadError} ZIPファイルの作成に失敗した場合
   */
  private async _generateZipBlob(contents: Content[], name: string) {
    const zip = new JSZip()
    const folder = zip.folder(name)

    if (folder === null) {
      throw new MediaDownloadError('ZIPファイルの作成に失敗しました')
    }

    for (const content of contents) {
      folder.file(content.name, content.blob)
    }

    return await zip.generateAsync({ type: 'blob' })
  }

  /**
   * ファイルのデータ（blob）から、ダウンロード用URLを作成する
   * @param blob ファイルのデータ
   * @returns ダウンロード用URL
   */
  private _generateObjectUrl(blob: Blob) {
    return URL.createObjectURL(blob)
  }

  /**
   * ZIPファイルの情報を取得する
   */
  get file() {
    return this._file
  }
}

export { MediaZipGenerator, FileInformation }
