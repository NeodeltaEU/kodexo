import { Module } from '@uminily/common'
import { House } from './entities/House'

@Module({
  providers: [],
  entities: [House]
})
export class HousesModule {}
