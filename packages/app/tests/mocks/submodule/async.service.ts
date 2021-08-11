import { Service } from '@uminily/common'
import { Init } from '@uminily/injection'

@Service()
export class AsyncService {
  public valueInitFromAsync: boolean = false

  @Init()
  async init() {
    this.valueInitFromAsync = true
  }
}
