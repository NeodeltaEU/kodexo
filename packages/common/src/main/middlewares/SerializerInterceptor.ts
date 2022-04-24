import { NextFunction, Response } from '@tinyhttp/app'
import { MiddlewareHandling, RequestWithResult } from '../../interfaces'
import { plainToInstance } from 'class-transformer'
import { Class } from 'type-fest'

export class SerializerInterceptor<T> implements MiddlewareHandling {
  constructor(private readonly serializeToken: Class<T>, private multiple = false) {}

  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async use(req: RequestWithResult, res: Response, next: NextFunction) {
    if (this.multiple) {
      req.result = req.result.map(this.serialize)
      return next()
    }

    req.result = this.serialize(req.result)

    next()
  }

  /**
   *
   * @param data
   * @returns
   */
  private serialize(data: T) {
    return plainToInstance(this.serializeToken, data, {
      excludeExtraneousValues: true
    })
  }

  /**
   *
   * @param model
   * @param multiple
   * @returns
   */
  static forModel<Input>(model: Class<Input>, multiple = false) {
    return new SerializerInterceptor(model, multiple)
  }
}
