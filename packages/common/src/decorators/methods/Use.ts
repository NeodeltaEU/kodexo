import { Class } from 'type-fest'
import { Store } from '@uminily/injection'
import { MiddlewareHandling } from '../../interfaces'
import { MiddlewareBuilder } from '../../main/middlewares/MiddlewareBuilder'
import { getClass, isClass } from '../../utils'

export function Use(options: UseOptions): any {
  const parsedOptions = parseUseOptions(options)

  return (target: any, propertyKey?: string) => {
    let middlewareBuilder = MiddlewareBuilder.startFromController(target).fromMiddlewareToken(
      parsedOptions.token
    )

    if (propertyKey) middlewareBuilder = middlewareBuilder.forMethod(propertyKey)

    middlewareBuilder.build()
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
