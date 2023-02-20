import { Class } from 'type-fest'
import { MiddlewareHandling } from '../../../common/dist'
import { CrudRouteFactory } from '../CrudRoutesFactory'

/**
 * @depracated Use CrudController decorator instead
 * @param options {import('@kodexo/crud').CrudOptionsType}
 */
export function Crud(options: CrudOptionsType): ClassDecorator {
  const parsedOptions = parseCrudOptions(options)

  return (target: any) => {
    CrudRouteFactory.create(target, parsedOptions)
  }
}

function parseCrudOptions(options: CrudOptionsType): any {
  return options
}

export type CrudOptionsType = {
  model: Class<any>
  modelName?: string
  dto?: {
    createDto?: Class<any>
    updateDto?: Class<any>
  }
  limitDeepPopulate?: number
  middlewares?: MiddlewareCrudOptionsType
  interceptors?: MiddlewareCrudOptionsType
  decorators?: DecoratorCrudOptions
  serialization?: Class<any>
  openapi?: OpenApiOptionsType
  isIdInt?: boolean
}

export type MiddlewareCrudOptionsType = Partial<{
  getOne: Array<Class<MiddlewareHandling> | MiddlewareHandling>
  getMany: Array<Class<MiddlewareHandling> | MiddlewareHandling>
  createOne: Array<Class<MiddlewareHandling> | MiddlewareHandling>
  updateOne: Array<Class<MiddlewareHandling> | MiddlewareHandling>
  deleteOne: Array<Class<MiddlewareHandling> | MiddlewareHandling>
  recovery: Array<Class<MiddlewareHandling> | MiddlewareHandling>
}>

export type DecoratorCrudOptions = Partial<{
  getOne: Function[]
  getMany: Function[]
  createOne: Function[]
  updateOne: Function[]
  deleteOne: Function[]
  recovery: Function[]
}>

export type OpenApiOptionsType = Partial<{
  getOne: OpenApiRouteOptionsType
  getMany: OpenApiRouteOptionsType
  createOne: OpenApiRouteOptionsType
  updateOne: OpenApiRouteOptionsType
  deleteOne: OpenApiRouteOptionsType
  recovery: OpenApiRouteOptionsType
}>

export type OpenApiRouteOptionsType = {
  summary?: string
}
