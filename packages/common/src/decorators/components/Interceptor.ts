import { providerRegistry, Registries } from '@kodexo/injection'
import { MiddlewareProvider } from '../../main/middlewares'

export function Interceptor(options: any = {}): ClassDecorator {
  return (target: any) => {
    if (
      !(
        Object.getOwnPropertyNames(Object.getPrototypeOf(target.prototype)).includes('use') ||
        Object.getOwnPropertyNames(target.prototype).includes('use')
      )
    )
      throw new Error(`Interceptor ${target.name} does not have use() method`)

    const provider = new MiddlewareProvider(target, { interceptor: true })
    providerRegistry.registerProvider(Registries.INTERCEPTOR, provider)
  }
}
