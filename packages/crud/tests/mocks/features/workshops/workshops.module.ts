import { Module } from '@uminily/common'
import { Workshop } from './entities/workshop.entity'
import { WorkshopsService } from './workshops.service'

@Module({
  flags: ['workshops'],
  providers: [WorkshopsService],
  entities: [Workshop]
})
export class WorkshopsModule {}
