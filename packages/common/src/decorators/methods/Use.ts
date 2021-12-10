import { Class } from 'type-fest'
import { MiddlewareHandling } from '../../interfaces'
import { MiddlewareBuilder } from '../../main/middlewares/MiddlewareBuilder'

export function Use<T = any>(token: Class<MiddlewareHandling>, options?: T): any {
  return (target: any, propertyKey?: string) => {
    let middlewareBuilder = MiddlewareBuilder.startFromController(target).fromMiddlewareToken(token)

    if (propertyKey) middlewareBuilder = middlewareBuilder.forMethod(propertyKey)
    if (options) middlewareBuilder = middlewareBuilder.withArgs(options)

    middlewareBuilder.build()
  }
}
