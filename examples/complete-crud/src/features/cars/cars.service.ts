import { Service } from '@kodexo/common'
import { CrudService } from '@kodexo/crud'
import { Inject } from '@kodexo/injection'
import { ConnectionDatabase } from '@kodexo/mikro-orm'
import { Car } from './entities/car.entity'

@Service()
export class CarsService extends CrudService<Car> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, Car)
  }

  getRegistration(id: string) {
    return { registration: 'AA-BBB-CC' }
  }
}
