import { Service } from '@uminily/common'
import { Inject } from '@uminily/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@uminily/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { Car } from './entities/car.entity'

@Service()
export class CarsService extends CrudService<Car> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, Car)
  }
}
