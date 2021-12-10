import { Middleware } from '@uminily/common'
import { Inject } from '@uminily/injection'
import { UploadMiddleware } from '../../main'
import { S3StorageService } from './s3storage.service'

@Middleware()
export class S3UploadMiddleware extends UploadMiddleware {
  constructor(@Inject s3StorageService: S3StorageService) {
    super(s3StorageService)
  }
}
