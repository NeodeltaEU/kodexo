import { Module } from '@kodexo/common'
import { MikroModule } from '@kodexo/mikro-orm'
import { UsersModule } from './features/users/users.module'

@Module({
  imports: [MikroModule, UsersModule]
})
export class CompleteCrudModule {}
