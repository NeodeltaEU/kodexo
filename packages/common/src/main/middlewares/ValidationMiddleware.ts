import { Handler, NextFunction, Request, Response } from '@tinyhttp/app'
import { HttpError } from '@uminily/errors'
import { MiddlewareHandling } from '../../interfaces'

import { validateOrReject, ValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { Class } from 'type-fest'

export class ValidationMiddleware implements MiddlewareHandling {
  constructor(private dtoToken: Class) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const dto: any = plainToClass(this.dtoToken, req.body)

    try {
      await validateOrReject(dto, { whitelist: true, forbidUnknownValues: true })

      req.body = dto

      next()
    } catch (err) {
      console.error(err)

      if (!Array.isArray(err)) return next(err)

      // TODO: smart handling for class validator
      if (err[0] instanceof ValidationError && !err[0].property)
        return next(HttpError.UnprocessableEntity())

      const errors = err.reduce((result, validationError) => {
        const { property, constraints } = validationError

        Object.values(constraints).forEach(message => {
          result.push({ property, message })
        })

        return result
      }, [])

      return next(
        HttpError.UnprocessableEntity({
          message: `An error occurred with the body passed, see below.`,
          details: errors
        })
      )
    }
  }
}
