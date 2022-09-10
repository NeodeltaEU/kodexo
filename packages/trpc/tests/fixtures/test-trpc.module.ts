import { Module } from '@kodexo/common'
import { TRPCModule } from '../../src/components/trpc.module'

@Module({
  imports: [TRPCModule]
})
export class TestTRPCModule {}
