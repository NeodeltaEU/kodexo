import { NextFunction, Request, Response } from '@tinyhttp/app'
import { HttpError } from '@uminily/errors'
import { MiddlewareHandling } from '../../interfaces'

import { validateOrReject, ValidationError } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { Class } from 'type-fest'

export class ValidationMiddleware implements MiddlewareHandling {
  constructor(private dtoToken: Class) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const dto: any = plainToInstance(this.dtoToken, req.body)

    try {
      await validateOrReject(dto, { whitelist: true, forbidUnknownValues: true })

      req.body = dto

      next()
    } catch (err) {
      if (!Array.isArray(err)) throw err

      // TODO: smart handling for class validator
      if (err[0] instanceof ValidationError && !err[0].property)
        throw HttpError.UnprocessableEntity()

      const errors = err.reduce((result, validationError) => {
        const { property, constraints } = validationError

        // TODO: Handle nested errors with children & make some tests
        if (!constraints) {
          result.push({ property, message: 'An arror has occured during validation' })
          return result
        }

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
