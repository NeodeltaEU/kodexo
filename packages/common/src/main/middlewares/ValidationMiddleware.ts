import { HttpError } from '@kodexo/errors'
import { NextFunction, Request, Response } from '@tinyhttp/app'
import { plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { Class } from 'type-fest'
import { MiddlewareHandling } from '../../interfaces'

function handleChildrenErrors(
  result: Array<any>,
  errors: ValidationError[],
  propertiesTree: string
) {
  if (!errors.length) return result

  errors.forEach(error => {
    const { property, constraints, children } = error

    if (children?.length) {
      handleChildrenErrors(result, children, `${propertiesTree}.${property}`)
    }

    if (!constraints) {
      result.push({
        property: `${propertiesTree}.${property}`,
        message: 'An error has occured during validation.'
      })
      return
    }

    Object.values(constraints).forEach(message => {
      result.push({ property: `${propertiesTree}.${property}`, message })
    })
  })

  return result
}

export class ValidationMiddleware implements MiddlewareHandling {
  constructor(private dtoToken: Class<any>) {}

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
        const { property, constraints, children } = validationError

        // TODO: Handle nested errors with children & make some tests
        if (!constraints) {
          if (!children?.length)
            result.push({ property, message: 'An error has occured during validation.' })

          return handleChildrenErrors(result, validationError.children, property)
        }

        Object.values(constraints).forEach(message => {
          result.push({ property, message })
        })

        return result
      }, [])

      throw HttpError.UnprocessableEntity({
        message: `An error has occurred with the body passed, see below.`,
        details: errors
      })
    }
  }
}
