import { Module } from '@uminily/common'
import { S3UploadMiddleware } from './s3uploader.middleware'
import { S3StorageService } from './s3storage.service'

@Module({
  providers: [S3StorageService, S3UploadMiddleware]
})
export class S3StorageModule {}
