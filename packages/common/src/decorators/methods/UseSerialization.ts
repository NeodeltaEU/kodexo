import { Class } from 'type-fest'
import { MiddlewareBuilder } from '../../main/middlewares'
import { SerializerInterceptor } from '../../main/middlewares/SerializerInterceptor'
import { isClass } from '../../utils'

export function UseSerialization(options: UseValidationOptions): MethodDecorator {
  const parsedOptions = parseUseOptions(options)

  return (target: any, propertyKey: string | symbol) => {
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

type UseValidationOptions = Class
