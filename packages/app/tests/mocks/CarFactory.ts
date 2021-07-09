import { Factory } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { RegistrationService } from './RegistrationService'

@Factory()
export class CarFactory {
  @Inject private registrationService: RegistrationService

  public currentCar: any

  constructor() {
    this.currentCar = {
      id: 3,
      model: 'Jaguar',
      registration: this.registrationService.getRegistrationForCar(3)
    }
  }
}
