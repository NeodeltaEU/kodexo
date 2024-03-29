import {
  Endpoint,
  EndpointBuilder,
  MiddlewareBuilder,
  MiddlewareHandling,
  RouteMethods,
  SerializerInterceptor
} from '@kodexo/common'
import { DevError, HttpError } from '@kodexo/errors'
import { PathParam } from '@kodexo/openapi'
import { instanceToPlain } from 'class-transformer'
import { ValidationError, validateOrReject } from 'class-validator'
import * as pluralize from 'pluralize'
import { Class } from 'type-fest'
import { CrudService } from './CrudService'
import { RequestParser } from './RequestParser'
import { REQUEST_CONTEXT } from './constants'
import { CrudOptionsType } from './decorators'
import { RequestParsedResult } from './interfaces'
import { CrudControllerInterface } from './interfaces/CrudControllerInterface'

export class CrudRouteFactory {
  constructor(protected target: any, protected options: CrudOptionsType) {
    this.create()
  }

  static create(target: any, options: CrudOptionsType): CrudRouteFactory {
    return new CrudRouteFactory(target, options)
  }

  private defaultRoutes = [
    {
      method: RouteMethods.GET,
      path: '/',
      name: 'getMany'
    },
    {
      method: RouteMethods.GET,
      path: '/:id/recovery',
      name: 'recovery'
    },
    {
      method: RouteMethods.GET,
      path: '/:id',
      name: 'getOne'
    },
    {
      method: RouteMethods.POST,
      path: '/',
      name: 'createOne'
    },
    {
      method: RouteMethods.PATCH,
      path: '/:id',
      name: 'updateOne'
    },
    {
      method: RouteMethods.DELETE,
      path: '/:id',
      name: 'deleteOne'
    }
  ]

  /**
   *
   */
  // TODO: REFACTOR ALL OF THIS !!!
  private create() {
    this.defaultRoutes.forEach(route => {
      const { name, path, method } = route

      let descriptor,
        validation,
        statusCode,
        summary,
        pathParam: PathParam | null = null,
        middlewares: Array<Class<MiddlewareHandling> | MiddlewareHandling> = [],
        interceptors: Array<Class<MiddlewareHandling> | MiddlewareHandling> = []

      if (this.options?.middlewares?.hasOwnProperty(name)) {
        middlewares = (this.options.middlewares as any)[name] as Array<
          Class<MiddlewareHandling> | MiddlewareHandling
        >
      }

      if (this.options?.interceptors?.hasOwnProperty(name)) {
        interceptors = (this.options.interceptors as any)[name] as Array<
          Class<MiddlewareHandling> | MiddlewareHandling
        >
      }

      if (this.options?.decorators?.hasOwnProperty(name)) {
        ;(this.options.decorators as any)[name].forEach((decorator: Function) => {
          decorator(this.target, name)
        })
      }

      const entityName = this.options.modelName ? this.options.modelName : this.options.model.name

      switch (name) {
        case 'getMany':
          descriptor = this.prepareRoute(this.prepareGetManyRoute())
          summary = `Get many ${pluralize(entityName)}`
          break

        case 'getOne':
          descriptor = this.prepareRoute(this.prepareGetOneRoute())
          summary = `Get one ${entityName}`
          pathParam = {
            schema: { type: 'string' },
            name: 'id',
            description: `The id of the ${entityName}`
          }
          break

        case 'createOne':
          descriptor = this.prepareRoute(this.prepareCreateOneRoute())
          summary = `Create one ${entityName}`
          validation = this.options.dto?.createDto
          statusCode = 201
          break

        case 'updateOne':
          descriptor = this.prepareRoute(this.prepareUpdateOneRoute())
          summary = `Update one ${entityName}`
          validation = this.options.dto?.updateDto
          pathParam = {
            schema: { type: 'string' },
            name: 'id',
            description: `The id of the ${entityName}`
          }
          break

        case 'deleteOne':
          descriptor = this.prepareRoute(this.prepareDeleteOneRoute())
          summary = `Delete one ${entityName}`
          pathParam = {
            schema: { type: 'string' },
            name: 'id',
            description: `The id of the ${entityName}`
          }
          break

        case 'recovery':
          descriptor = this.prepareRoute(this.prepareRecoveryRoute())
          summary = `Recovery one ${entityName}`
          pathParam = {
            schema: { type: 'string' },
            name: 'id',
            description: `The id of the ${entityName}`
          }
          break
      }

      //
      const endpoint = this.buildRoute(
        path,
        method,
        name,
        descriptor as Function,
        middlewares,
        interceptors,
        statusCode
      )

      //
      if (pathParam) endpoint.store.set('openapi:pathParams', [pathParam])

      //
      if (summary) endpoint.store.set('openapi:summary', summary)

      //
      if (validation) endpoint.store.set('openapi:validation', validation)

      //
      if (this.options.serialization && name !== 'deleteOne') {
        endpoint.store.set('openapi:serialization', this.options.serialization)

        if (name === 'getMany') {
          endpoint.store.set('openapi:serialization:multiple', true)
        }

        MiddlewareBuilder.startFromController(this.target)
          .forMethod(name as string)
          .fromInstanciedMiddleware(
            SerializerInterceptor.forModel(this.options.serialization, name === 'getMany')
          )
          .isInterceptor()
          .build()
      }
    })
  }

  /**
   *
   */
  private prepareCreateOneRoute() {
    return async (service: CrudService<any>, parsedParams: RequestParsedResult) => {
      const { createDto, assign, queryParams } = parsedParams

      const { req } = queryParams

      const groups = (req as any)?.groups || []

      try {
        await validateOrReject(createDto, {
          whitelist: true,
          groups,
          always: true,
          forbidUnknownValues: true
        })

        // TODO: handle assign with validator, today override property from req.assign
        Object.entries(assign).forEach(([key, value]) => {
          createDto[key] = value
        })

        return service.createOne(instanceToPlain(createDto), queryParams)
      } catch (err) {
        /* istanbul ignore next */
        if (!Array.isArray(err)) throw err

        // TODO: smart handling for class validator, children etc...
        if (err[0] instanceof ValidationError && !err[0].property)
          throw HttpError.UnprocessableEntity()

        const errors = err.reduce((result, validationError) => {
          const { property, constraints, children } = validationError

          if (constraints) {
            Object.values(constraints).forEach(message => {
              result.push({ property, message })
            })
          }

          // TODO: here is very ugly
          if (children?.length > 0) {
            children.forEach((child: any) => {
              if (child.constraints) {
                Object.values(child.constraints).forEach(message => {
                  result.push({ property: `${property}`, message })
                })
              }
            })
          }

          return result
        }, [])

        throw HttpError.UnprocessableEntity({
          message: `An error occurred with the body passed, see below.`,
          details: errors
        })
      }
    }
  }

  /**
   *
   * @returns
   */
  private prepareUpdateOneRoute() {
    return async (service: CrudService<any>, parsedParams: RequestParsedResult) => {
      const {
        updateDto,
        queryParams,
        assign,
        pathParams: { id }
      } = parsedParams

      // TODO: Throw error & handle them with custom catch,

      const { req } = queryParams

      const groups = (req as any)?.groups || []

      try {
        //console.log('amont', updateDto)

        await validateOrReject(updateDto, {
          whitelist: true,
          always: true,
          skipMissingProperties: true,
          forbidUnknownValues: true,
          groups
        })

        // TODO: handle assign with validator, today override property from req.assign
        Object.entries(assign).forEach(([key, value]) => {
          updateDto[key] = value
        })

        delete updateDto[REQUEST_CONTEXT]

        return service.updateOne(id, instanceToPlain(updateDto), queryParams)
      } catch (err) {
        /* istanbul ignore next */
        if (!Array.isArray(err)) throw err

        // TODO: smart handling for class validator
        if (err[0] instanceof ValidationError && !err[0].property)
          throw HttpError.UnprocessableEntity()

        const errors = err.reduce((result, validationError) => {
          const { property, constraints } = validationError

          Object.values(constraints).forEach(message => {
            result.push({ property, message })
          })

          return result
        }, [])

        throw HttpError.UnprocessableEntity({
          message: `An error occurred with the body passed, see below.`,
          details: errors
        })
      }
    }
  }

  /**
   *
   * @returns
   */
  private prepareDeleteOneRoute() {
    return (service: CrudService<any>, parsedParams: RequestParsedResult) => {
      const {
        pathParams: { id }
      } = parsedParams

      return service.deleteOne(id)
    }
  }

  /**
   *
   * @returns
   */
  private prepareRecoveryRoute() {
    return (service: CrudService<any>, parsedParams: RequestParsedResult) => {
      const {
        pathParams: { id },
        queryParams
      } = parsedParams

      return service.recovery(id, queryParams)
    }
  }

  /**
   *
   * @returns
   */
  private prepareGetManyRoute() {
    return async (
      service: CrudService<any>,
      parsedParams: RequestParsedResult,
      endpoint: Endpoint
    ) => {
      const { entities, count } = await service.getMany(parsedParams.queryParams)

      // TODO: return count on an Header (make domain metho & decorator then)

      endpoint.setHeader('X-Total-Count', count)
      return entities
    }
  }

  /**
   *
   * @returns
   */
  private prepareGetOneRoute() {
    return (service: CrudService<any>, parsedParams: RequestParsedResult) => {
      const {
        pathParams: { id },
        queryParams
      } = parsedParams

      return service.getOne(id, queryParams)
    }
  }

  /**
   *
   * @param handler
   * @returns
   */
  private prepareRoute(handler: Function) {
    const parserOptions = {
      ...this.options.dto,
      parseIntId: this.options.isIdInt,
      limitDeepPopulate: this.options.limitDeepPopulate || 6
    }

    return function (this: CrudControllerInterface<any>, req: any, res: any, endpoint: Endpoint) {
      if (!this.service)
        throw new DevError(
          `Controller ${this.constructor.name}: service is not defined, please define through CrudControllerInterface.`
        )

      return handler(
        this.service,
        RequestParser.parse(req, parserOptions, this.service.entityName),
        endpoint
      )
    }
  }

  /**
   *
   * @param path
   * @param method
   * @param propertyName
   * @param descriptor
   * @returns
   */
  private buildRoute(
    path: string,
    method: RouteMethods,
    propertyName: string,
    descriptor: Function,
    middlewares: Array<Class<MiddlewareHandling> | MiddlewareHandling>,
    interceptors: Array<Class<MiddlewareHandling> | MiddlewareHandling>,
    statusCode?: number
  ) {
    return EndpointBuilder.startWithController(this.target)
      .fromProperty(propertyName)
      .forPath(path)
      .withMethod(method)
      .withDescriptor(descriptor)
      .withStatusCode(statusCode)
      .fromExternalDecorator()
      .withMiddlewares(middlewares)
      .withInterceptors(interceptors)
      .build()
  }
}
