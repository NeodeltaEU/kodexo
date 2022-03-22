import { MiddlewareHandling, NextFunction, Request, Response } from '@kodexo/common'
import * as Busboy from 'busboy'
import * as bytes from 'bytes'
import { HttpError } from '@kodexo/errors'
import { StorageService } from './StorageService'
import { FileResult, UploadFileStorageOptions } from '../interfaces'

export abstract class UploadMiddleware implements MiddlewareHandling {
  constructor(protected uploader: StorageService) {}

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public async use(req: any, res: Response, next: NextFunction, options: UploadFileStorageOptions) {
    const alreadyUploadedFiles: FileResult[] = []
    const pendingFileWrites: Promise<any>[] = []
    const maxFiles = options.maxFiles || 5

    const authorizedFieldnames = (options.fields || []).map(field => field.name)

    const executeUpload = (): Promise<void> =>
      new Promise((resolve, reject) => {
        const busboy = new Busboy({
          headers: req.headers as any,
          limits: {
            fileSize: Math.round(bytes.parse(options.sizeLimit || '5mb')),
            files: maxFiles
          }
        })

        req.files = {}
        req.body = req.body || {}

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
          if (fieldname.length === 0) reject(HttpError.BadRequest('A fieldname is empty'))
          if (filename.length === 0) reject(HttpError.BadRequest('A filename is empty'))
          if (authorizedFieldnames.length && !authorizedFieldnames.includes(fieldname))
            reject(HttpError.BadRequest('Fieldname not authorized'))

          file.on('limit', () => {
            reject(HttpError.BadRequest('File size limit exceeded'))
          })

          const uploadPromise = this.uploader
            .uploadFile(file, fieldname, filename, encoding, mimetype, options)
            .then(fileInfos => {
              if (!Array.isArray(req.files[fieldname])) req.files[fieldname] = []
              req.files[fieldname].push(fileInfos)
              alreadyUploadedFiles.push(fileInfos)
            })

          pendingFileWrites.push(uploadPromise)
        })

        busboy.on('field', (fieldname, val) => {
          req.body[fieldname] = val
        })

        busboy.on('filesLimit', () => {
          reject(
            HttpError.BadRequest(
              `You are not allowed to send more than ${maxFiles} files at the same time`
            )
          )
        })

        busboy.on('error', () => {
          reject(HttpError.InternalServerError('Error while parsing request on upload'))
        })

        busboy.on('finish', async () => {
          try {
            await Promise.all(pendingFileWrites)
          } catch (e) {
            reject(e)
          }

          resolve()
        })

        req.pipe(busboy)
      })

    try {
      await executeUpload()
      next()
    } catch (e) {
      await Promise.allSettled(pendingFileWrites)

      this.removeFiles(alreadyUploadedFiles)

      next(e)
    }
  }

  /**
   *
   * @param files
   */
  protected async removeFiles(files: FileResult[]) {
    await this.uploader.removeFiles(files.map(file => file.path))
  }
}
