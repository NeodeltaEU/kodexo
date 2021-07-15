import { Service } from '@uminily/common'
import { Inject } from '@uminily/injection'
import { CarFactory } from './CarFactory'
import { RegistrationService } from './RegistrationService'

@Service()
export class CarService {
  constructor(
    @Inject private carFactory: CarFactory,
    @Inject private registrationService: RegistrationService
  ) {}

  /**
   *
   */
  async getCars() {
    return [{ model: 'Mégane', id: 1 }].map(car => {
      return { ...car, registration: this.registrationService.getRegistrationForCar(car.id) }
    })
  }

  getCar() {
    return this.carFactory.currentCar
  }
}
