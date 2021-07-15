import { Service } from '@uminily/common'

@Service()
export class CityService {
  getCities() {
    return ['Paris', 'Monaco', 'Rome']
  }
}
