import { Class } from 'type-fest'
import { providerRegistry } from '../../../../injection/dist'
import { MiddlewareHandling } from '../../interfaces'
import { MiddlewareBuilder } from '../../main/middlewares/MiddlewareBuilder'
import { isClass } from '../../utils'

export function Use(options: UseOptions): MethodDecorator {
  const parsedOptions = parseUseOptions(options)

  //console.log(parsedOptions)

  return (target: any, propertyKey: string | symbol) => {
    MiddlewareBuilder.startFromController(target)
      .forMethod(propertyKey as string)
      .fromMiddlewareToken(parsedOptions.token)
      .build()
  }
}

function parseUseOptions(options: UseOptions): any {
  if (isClass(options)) {
    const token = options
    return { token }
  }

  return options
}

type UseOptions = Class<MiddlewareHandling>
