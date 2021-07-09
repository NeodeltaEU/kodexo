import { providerRegistry } from '@uminily/injection'
import { Controller } from '..'
import { ControllerProvider } from '../../main'

@Controller('/wesh')
class MyController {}

describe('Controller', () => {
  it('should return the provider registered', () => {
    const provider = providerRegistry.get(MyController)
    expect(provider).toBeInstanceOf(ControllerProvider)
  })
})
