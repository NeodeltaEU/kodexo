import { Service } from '@uminily/common'

@Service()
export class RegistrationService {
  /**
   *
   * @param id
   */
  getRegistrationForCar(id: number) {
    switch (id) {
      case 1:
        return '11-111-111'

      case 2:
        return '22-222-222'

      case 3:
        return '33-333-333'

      default:
        throw new Error('Not found')
    }
  }
}
