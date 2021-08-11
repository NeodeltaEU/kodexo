import { Module } from '@uminily/common'
import { ConnectionDatabase } from './ConnectionDatabase'

@Module({
  imports: [ConnectionDatabase]
})
export class MikroModule {}
