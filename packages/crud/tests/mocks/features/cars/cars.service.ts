import { Service } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { ConnectionDatabase, RepositoryBuilder } from '@kodexo/mikro-orm'

import { CrudService } from '../../../../src/CrudService'
import { Car } from './entities/car.entity'

@Service()
export class CarsService extends CrudService<Car> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, Car)
  }
}
