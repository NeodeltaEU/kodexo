import { Module } from '@kodexo/common'
import { ConnectionDatabase } from './ConnectionDatabase'

@Module({
  imports: [ConnectionDatabase]
})
export class MikroModule {}
