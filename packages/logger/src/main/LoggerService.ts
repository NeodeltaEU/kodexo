import { Service } from '@uminily/common'
import * as pino from 'pino'
import * as pinoHttp from 'pino-http'
import { Logger } from 'pino'

@Service()
export class LoggerService {
  private readonly logger: Logger

  constructor() {
    this.logger = pino({
      prettyPrint: {
        colorize: true
      }
    })
  }

  /**
   *
   * @returns
   */
  getLoggerMiddleware() {
    return pinoHttp({
      logger: this.logger
    })
  }

  /**
   *
   * @param obj
   * @returns
   */
  info(obj: any) {
    return this.logger.info(obj)
  }

  /**
   *
   * @param obj
   */
  error(obj: any) {
    return this.logger.error(obj)
  }

  /**
   *
   * @param obj
   */
  debug(obj: any) {
    return this.logger.debug(obj)
  }

  /**
   *
   * @param obj
   */
  warn(obj: any) {
    return this.logger.warn(obj)
  }

  /**
   *
   * @param obj
   */
  fatal(obj: any) {
    return this.logger.fatal(obj)
  }
}
