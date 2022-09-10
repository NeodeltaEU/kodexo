import { Module } from '@kodexo/common'
import { TRPCService } from './trpc.service'

@Module({
  providers: [TRPCService]
})
export class TRPCModule {}
