import { pMap } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import { Readable } from 'stream'
import {
  FileResult,
  GetFileStreamStorageOptions,
  RemoveFileStorageOptions,
  UploadFileStorageOptions
} from '../interfaces'

import * as mimetypes from 'mime-types'
import * as Path from 'path'
import * as meter from 'stream-meter'
import { getMimeType } from 'stream-mime-type'
import * as uniqid from 'uniqid'

export abstract class StorageService {
  protected mainFolder: string = ''

  constructor(protected config: ConfigurationService) {
    this.mainFolder = this.config.get('upload.mainFolder') || ''
  }

  /**
   *
   * @param mainFolder
   * @param subfolder
   * @param key
   * @returns
   */
  private cleanPath(subfolder: string, key: string) {
    let normalized = Path.posix.normalize(this.mainFolder + '/' + subfolder + '/' + key)

    while (normalized.startsWith('/')) {
      normalized = normalized.substring(1)
    }

    return normalized
  }

  /**
   *
   * @param file
   */
  protected async processFile(
    file: Readable,
    filename: string,
    subfolder: string,
    options: UploadFileStorageOptions
  ) {
    let { stream, mime } = await getMimeType(file, { strict: true, filename })

    const sizeStream = meter()

    stream = stream.pipe(sizeStream)

    if (!mime) mime = mimetypes.lookup(filename) || 'application/octet-stream'

    if (options?.authorizedMimetypes?.length && !options.authorizedMimetypes.includes(mime))
      throw new Error(`Not authorized mimetype for file: ${filename}`)

    const extension = mimetypes.extension(mime)
    const key = `${uniqid()}.${extension}`
    const path = this.cleanPath(subfolder, key)

    return { path, stream, mime, sizeStream, key, extension }
  }

  /**
   *
   * @param file
   * @param fieldname
   * @param filename
   * @param encoding
   * @param mimetype
   */
  abstract uploadFile(
    file: Readable,
    fieldname: string,
    filename: string,
    encoding: string,
    mimetype: string,
    args?: UploadFileStorageOptions
  ): Promise<FileResult>

  /**
   *
   * @param path
   */
  abstract getFileStream(path: string, args?: GetFileStreamStorageOptions): Promise<Readable>

  /**
   *
   * @param file
   */
  abstract removeFile(path: string, args?: RemoveFileStorageOptions): Promise<void>

  /**
   *
   */
  async removeFiles(paths: string[], args?: RemoveFileStorageOptions) {
    return pMap(paths, path => this.removeFile(path, args), { concurrency: 1 })
  }
}
