import { Module } from '@kodexo/common'
import { S3StorageModule } from '../../../../src'
import { FilesController } from './files.controller'

@Module({
  routing: {
    '/': [FilesController]
  },
  imports: [S3StorageModule]
})
export class FilesModule {}
