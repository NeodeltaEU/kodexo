import { Class } from 'type-fest'
import { MiddlewareBuilder } from '../../main/middlewares'
import { ValidationMiddleware } from '../../main/middlewares/ValidationMiddleware'
import { isClass } from '../../utils'

export function UseValidation(options: UseValidationOptions): MethodDecorator {
  const parsedOptions = parseUseOptions(options)

  //console.log(parsedOptions)

  return (target: any, propertyKey: string | symbol) => {
    MiddlewareBuilder.startFromController(target)
      .forMethod(propertyKey as string)
      .fromInstanciedMiddleware(new ValidationMiddleware(parsedOptions.dtoToken))
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
