import { Module } from '@uminily/common'
import { FilesModule } from './features/files/files.module'

@Module({
  //routing: {
  //  '/': 'tests/mocks/**/*.controller.ts'
  //},
  imports: [FilesModule]
})
export class AppModule {}
