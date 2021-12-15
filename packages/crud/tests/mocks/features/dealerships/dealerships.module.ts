import { Module } from '@uminily/common'
import { DealershipsService } from './dealerships.service'
import { Dealership } from './entities/dealership.entity'

@Module({
  flags: ['dealerships'],
  providers: [DealershipsService],
  entities: [Dealership]
})
export class DealershipsModule {}
