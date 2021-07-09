import { Service } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { CarFactory } from './CarFactory'
import { RegistrationService } from './RegistrationService'

@Service()
export class CarService {
  @Inject private registrationService: RegistrationService
  @Inject private carFactory: CarFactory

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
