import { Module } from '@kodexo/common'
import { UsersService } from '../users.service'
import { UsersTRPCRouter } from './users.trpc-router'

@Module({
  providers: [UsersService, UsersTRPCRouter]
})
export class UsersModule {}
