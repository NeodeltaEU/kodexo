import { Module } from '@kodexo/common'
import { CarFactory } from '../CarFactory'
import { AsyncService } from './async.service'
import { SubController } from './sub.controller'

@Module({
  routing: {
    '/sub': [SubController]
  },
  imports: [CarFactory, AsyncService]
})
export class SubModule {}
