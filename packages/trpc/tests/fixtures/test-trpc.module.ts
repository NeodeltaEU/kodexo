import { Module } from '@kodexo/common'
import { TRPCModule } from '../../src/components/trpc.module'
import { TRPCAppRouterService } from './app.trpc-router'
import { UsersModule } from './routers/users.module'

@Module({
  imports: [TRPCModule, UsersModule],
  providers: [TRPCAppRouterService]
})
export class TestTRPCModule {}
