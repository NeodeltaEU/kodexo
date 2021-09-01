import { Module } from '@uminily/common'
import { QueueingModule } from '../../src'
import { ChangeWordQueue } from './queues/ChangeWordQueue'

@Module({
  imports: [QueueingModule],
  queues: [ChangeWordQueue]
})
export class QueueTestModule {}
