import { pMap } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import { Readable } from 'stream'
import {
  FileResult,
  UploadFileStorageOptions,
  GetFileStreamStorageOptions,
  RemoveFileStorageOptions
} from '../interfaces'

import { getMimeType } from 'stream-mime-type'
import * as uniqid from 'uniqid'
import * as meter from 'stream-meter'
import * as mimetypes from 'mime-types'
import * as Path from 'path'

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
  protected async processFile(file: Readable, subfolder: string) {
    let { stream, mime } = await getMimeType(file)

    const sizeStream = meter()

    stream = stream.pipe(sizeStream)

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
