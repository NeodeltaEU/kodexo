import { Factory } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { RegistrationService } from './RegistrationService'

@Factory()
export class CarFactory {
  public currentCar: any

  constructor(@Inject private registrationService: RegistrationService) {
    this.currentCar = {
      id: 3,
      model: 'Jaguar',
      registration: this.registrationService.getRegistrationForCar(3)
    }
  }
}
