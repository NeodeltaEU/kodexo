import { Controller, Post, Use } from '@uminily/common'
import { FileResult, S3UploadFileStorageOptions, S3UploadMiddleware } from '../../../../src'
import { File } from '../../../../src/decorators'

@Controller('/files')
export class FilesController {
  @Use<S3UploadFileStorageOptions>(S3UploadMiddleware, {
    acl: 'public-read',
    maxFiles: 5,
    sizeLimit: '5mb',
    fields: [{ name: 'avatar', subfolder: '/avatars//' }]
  })
  @Post('/upload')
  async upload(@File('avatar') avatar: FileResult) {
    return {
      avatar,
      uploaded: true
    }
  }
}
