import { Service } from '@kodexo/common'
import { Init } from '@kodexo/injection'

@Service()
export class AsyncService {
  public valueInitFromAsync: boolean = false

  @Init()
  async init() {
    this.valueInitFromAsync = true
  }
}
