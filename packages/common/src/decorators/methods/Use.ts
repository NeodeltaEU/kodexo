import { Class } from 'type-fest'
import { MiddlewareHandling } from '../../interfaces'
import { MiddlewareBuilder } from '../../main/middlewares/MiddlewareBuilder'
import { isClass } from '../../utils'

export function Use(options: UseOptions): any {
  const parsedOptions = parseUseOptions(options)

  //console.log(parsedOptions)

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
