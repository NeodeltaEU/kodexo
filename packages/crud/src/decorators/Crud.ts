import { Class } from 'type-fest'
import { MiddlewareHandling } from '../../../common/dist'
import { CrudRouteFactory } from '../CrudRoutesFactory'

/**
 *
 * @param options
 */
export function Crud<M, C, U>(options: CrudOptionsType<M, C, U>): ClassDecorator {
  const parsedOptions = parseCrudOptions(options)

  return (target: any) => {
    CrudRouteFactory.create<M, C, U>(target, parsedOptions)
  }
}

function parseCrudOptions<M, C, U>(options: CrudOptionsType<M, C, U>): any {
  return options
}

export type CrudOptionsType<M, C, U> = {
  model: Class<M>
  dto?: {
    createDto?: Class<C>
    updateDto?: Class<U>
  }
  limitDeepPopulate?: number
  middlewares?: MiddlewareCrudOptionsType
  interceptors?: MiddlewareCrudOptionsType
  decorators?: DecoratorCrudOptions
}

export type MiddlewareCrudOptionsType = Partial<{
  getOne: Array<Class<MiddlewareHandling> | MiddlewareHandling>
  getMany: Array<Class<MiddlewareHandling> | MiddlewareHandling>
  createOne: Array<Class<MiddlewareHandling> | MiddlewareHandling>
  updateOne: Array<Class<MiddlewareHandling> | MiddlewareHandling>
  deleteOne: Array<Class<MiddlewareHandling> | MiddlewareHandling>
}>

export type DecoratorCrudOptions = Partial<{
  getOne: Function[]
  getMany: Function[]
  createOne: Function[]
  updateOne: Function[]
  deleteOne: Function[]
}>
