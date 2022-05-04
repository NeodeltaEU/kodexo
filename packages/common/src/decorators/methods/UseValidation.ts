import { Store } from '@kodexo/injection'
import { Class } from 'type-fest'
import { MiddlewareBuilder } from '../../main/middlewares'
import { ValidationMiddleware } from '../../main/middlewares/ValidationMiddleware'
import { isClass } from '../../utils'

export function UseValidation(options: UseValidationOptions): MethodDecorator {
  const parsedOptions = parseUseOptions(options)

  return (target: any, propertyKey: string | symbol, descriptor: any) => {
    MiddlewareBuilder.startFromController(target)
      .forMethod(propertyKey as string)
      .fromInstanciedMiddleware(new ValidationMiddleware(parsedOptions.dtoToken))
      .build()

    const store = Store.from(target, propertyKey, descriptor)
    store.set('openapi:validation', parsedOptions.dtoToken)
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
