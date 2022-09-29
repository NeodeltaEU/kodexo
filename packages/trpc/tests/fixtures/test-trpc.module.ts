import { Module } from '@kodexo/common'
import { TRPCModule } from '../../src/components/trpc.module'
import { UsersTRPCRouter } from './routers/users.trpc-router'
import { UsersService } from './users.service'

@Module({
  imports: [TRPCModule],
  providers: [UsersService, UsersTRPCRouter]
})
export class TestTRPCModule {}
