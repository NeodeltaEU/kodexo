import { providerRegistry, Registries } from '@uminily/injection'
import { MiddlewareProvider } from '../../main/middlewares'

export function Middleware(options: any = {}): ClassDecorator {
  const parsedOptions = parseMiddlewareOptions(options)

  return (target: any) => {
    if (
      !(
        Object.getOwnPropertyNames(Object.getPrototypeOf(target.prototype)).includes('use') ||
        Object.getOwnPropertyNames(target.prototype).includes('use')
      )
    )
      throw new Error(`Middleware ${target.name} does not have use() method`)

    const provider = new MiddlewareProvider(target)
    providerRegistry.registerProvider(Registries.MIDDLEWARE, provider)
  }
}

function parseMiddlewareOptions(options: any): any {
  return options
}
