import { Service } from '@kodexo/common'

@Service()
export class CityService {
  getCities() {
    return ['Paris', 'Monaco', 'Rome']
  }
}
