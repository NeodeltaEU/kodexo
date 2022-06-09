import { Store } from '@kodexo/injection'
import { Class } from 'type-fest'
import { MiddlewareBuilder } from '../../main/middlewares'
import { SerializerInterceptor } from '../../main/middlewares/SerializerInterceptor'
import { isClass } from '../../utils'

export function UseSerialization(options: UseValidationOptions): MethodDecorator {
  const parsedOptions = parseUseOptions(options)

  return (target: any, propertyKey: string | symbol, descriptor: any) => {
    const store = Store.from(target, propertyKey, descriptor)
    store.set('openapi:serialization', parsedOptions.dtoToken)

    MiddlewareBuilder.startFromController(target)
      .forMethod(propertyKey as string)
      .fromInstanciedMiddleware(new SerializerInterceptor(parsedOptions.dtoToken))
      .isInterceptor()
      .build()
  }
}

function parseUseOptions(options: UseValidationOptions): any {
  if (isClass(options)) {
    const dtoToken = options
    return { dtoToken }
  }

  return options
}

type UseValidationOptions = Class<any>
