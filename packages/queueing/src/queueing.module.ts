import { Module } from '@kodexo/common'
import { QueueManager } from './main'

@Module({
  imports: [QueueManager]
})
export class QueueingModule {}
