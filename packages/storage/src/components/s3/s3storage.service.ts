import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { Service } from '@uminily/common'
import { ConfigurationService } from '@uminily/config'
import { Inject } from '@uminily/injection'
import { Readable } from 'stream'
import { FileResult, RemoveFileStorageOptions, UploadFileStorageOptions } from '../../interfaces'
import { StorageService } from '../../main'

@Service()
export class S3StorageService extends StorageService {
  private client: S3Client
  private cdnRootUrl?: string
  private bucket: string

  constructor(@Inject config: ConfigurationService) {
    super(config)

    const accessKeyId: string = this.config.getOrFail('upload.providers.s3.credentials.accessKeyId')
    const secretAccessKey: string = this.config.getOrFail(
      'upload.providers.s3.credentials.secretAccessKey'
    )
    const region: string = this.config.getOrFail('upload.providers.s3.credentials.region')
    const endpoint: string = this.config.getOrFail('upload.providers.s3.credentials.endpoint')

    this.bucket = this.config.getOrFail('upload.providers.s3.bucket')

    this.client = new S3Client({
      forcePathStyle: true,
      credentials: {
        accessKeyId, //'VK4KJPSULIZZMCDG4XD7',
        secretAccessKey //'TEGYRzAg6a8VoS/ZoBGefWpPzjGS+VfphJ8h6Au2Lo8'
      },
      region, //: 'fra1'
      endpoint //: 'https://fra1.digitaloceanspaces.com'
    })

    if (this.config.get('upload.providers.s3.cdn.enabled') === true)
      this.cdnRootUrl = this.config.getOrFail('upload.providers.s3.cdn.endpoint')
  }

  /**
   *
   * @param file
   * @param fieldname
   * @param filename
   * @param encoding
   * @param mimetype
   * @returns
   */
  async uploadFile(
    file: Readable,
    fieldname: string,
    filename: string,
    encoding: string,
    mimetype: string,
    options: S3UploadFileStorageOptions
  ): Promise<FileResult> {
    let subfolder = ''

    if (options.fields) {
      const currentField = options.fields.find(field => field.name === fieldname)

      if (!currentField) throw new Error('Field not found')

      subfolder = currentField.subfolder || ''
    }

    const { path, stream, sizeStream, mime, key, extension } = await this.processFile(
      file,
      subfolder
    )

    const upload = new Upload({
      client: this.client,
      queueSize: 3,
      params: {
        ACL: options.acl || 'private',
        Bucket: this.bucket,
        Key: path,
        Body: Readable.from(stream),
        ContentType: mime
      }
    })

    upload.on('httpUploadProgress', progress => {
      //
    })

    await upload.done()

    // TODO: clean path with / etc
    const cdn = this.cdnRootUrl ? `${this.cdnRootUrl}/${path}` : undefined

    return {
      key,
      originalFilename: filename,
      originalMimetype: mimetype,
      size: sizeStream.bytes,
      mimetype: mime,
      encoding,
      extension: extension || null,
      path,
      cdn,
      metadata: {
        bucket: this.bucket
      }
    }
  }

  /**
   *
   * @param path
   * @returns
   */
  async getFileStream(path: string) {
    const command = new GetObjectCommand({ Key: path, Bucket: this.bucket })

    const { Body } = await this.client.send(command)

    if (!Body) throw new Error('File not found')

    return Body as Readable
  }

  /**
   *
   * @param path
   * @param args
   */
  async removeFile(path: string, args: S3RemoveFileStorageOptions): Promise<void> {
    const command = new DeleteObjectCommand({ Key: path, Bucket: this.bucket })
    await this.client.send(command)
  }
}

export type S3UploadFileStorageOptions = UploadFileStorageOptions & {
  acl?: 'private' | 'public-read'
}

export type S3RemoveFileStorageOptions = RemoveFileStorageOptions & {}
