import { Service } from '@neatsio/common'
import { Inject } from '@neatsio/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@neatsio/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { Car } from './entities/car.entity'

@Service()
export class CarsService extends CrudService<Car> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, Car)
  }
}
