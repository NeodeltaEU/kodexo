import { Request } from '@kodexo/app'
import { EndpointBuilder, RouteMethods } from '@kodexo/common'
import { HttpError } from '@kodexo/errors'
import { Inject } from '@kodexo/injection'
import { ConnectionDatabase } from '@kodexo/mikro-orm'
import { validateOrReject, ValidationError } from 'class-validator'
import { REQUEST_CONTEXT } from './constants'
import { CrudService } from './CrudService'
import { CrudOptionsType } from './decorators'
import { CrudControllerInterface } from './interfaces/CrudControllerInterface'
import { RequestParsedResult, RequestParser } from './RequestParser'

export class CrudRouteFactory<M, C, U> {
  constructor(protected target: any, protected options: CrudOptionsType<M, C, U>) {
    this.create()
  }

  static create<M, C, U>(
    target: any,
    options: CrudOptionsType<M, C, U>
  ): CrudRouteFactory<M, C, U> {
    return new CrudRouteFactory<M, C, U>(target, options)
  }

  private defaultRoutes = [
    {
      method: RouteMethods.GET,
      path: '/',
      name: 'getMany'
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
  private create() {
    this.defaultRoutes.forEach(route => {
      const { name, path, method } = route

      let descriptor, statusCode

      switch (name) {
        case 'getMany':
          descriptor = this.prepareRoute(this.prepareGetManyRoute())
          break

        case 'getOne':
          descriptor = this.prepareRoute(this.prepareGetOneRoute())
          break

        case 'createOne':
          descriptor = this.prepareRoute(this.prepareCreateOneRoute())
          statusCode = 201
          break

        case 'updateOne':
          descriptor = this.prepareRoute(this.prepareUpdateOneRoute())
          break

        case 'deleteOne':
          descriptor = this.prepareRoute(this.prepareDeleteOneRoute())
          break
      }

      //
      return this.buildRoute(path, method, name, descriptor as Function, statusCode)
    })
  }

  /**
   *
   */
  private prepareCreateOneRoute() {
    return async (service: CrudService<M>, parsedParams: RequestParsedResult) => {
      const { createDto, queryParams } = parsedParams

      try {
        await validateOrReject(createDto, { whitelist: true, forbidUnknownValues: true })
        return service.createOne(createDto, queryParams)
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
  private prepareUpdateOneRoute() {
    return async (service: CrudService<M>, parsedParams: RequestParsedResult) => {
      const {
        updateDto,
        queryParams,
        pathParams: { id }
      } = parsedParams

      // TODO: Throw error & handle them with custom catch,

      try {
        await validateOrReject(updateDto, {
          whitelist: true,
          skipMissingProperties: true,
          forbidUnknownValues: true
        })

        delete updateDto[REQUEST_CONTEXT]

        return service.updateOne(id, updateDto, queryParams)
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
    return (service: CrudService<M>, parsedParams: RequestParsedResult) => {
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
  private prepareGetManyRoute() {
    return async (service: CrudService<M>, parsedParams: RequestParsedResult) => {
      const { entities, count } = await service.getMany(parsedParams.queryParams)

      // TODO: return count on an Header (make domain metho & decorator then)

      return entities
    }
  }

  /**
   *
   * @returns
   */
  private prepareGetOneRoute() {
    return (service: CrudService<M>, parsedParams: RequestParsedResult) => {
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
    const parserOptions = { ...this.options.dto }

    return function (this: CrudControllerInterface<M>, req: any, res: any) {
      return handler(this.service, RequestParser.parse(req, parserOptions, this.service.entityName))
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
    statusCode?: number
  ) {
    return EndpointBuilder.startWithController(this.target)
      .fromProperty(propertyName)
      .forPath(path)
      .withMethod(method)
      .withDescriptor(descriptor)
      .withStatusCode(statusCode)
      .fromExternalDecorator()
      .build()
  }
}
