import { Module } from '@uminily/common'
import { QueueManager } from './main'

@Module({
  imports: [QueueManager]
})
export class QueueingModule {}
