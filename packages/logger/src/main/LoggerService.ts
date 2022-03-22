import { Service } from '@kodexo/common'
import * as pino from 'pino'
import * as pinoHttp from 'pino-http'
import { Logger, Level } from 'pino'

@Service()
export class LoggerService {
  private readonly logger: Logger

  private lastLineContent: string

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
   */
  separator(level: Level = 'info') {
    const content = '--------------'

    if (this.lastLineContent === content) return

    switch (level) {
      case 'info':
        return this.info(content)
      case 'error':
        return this.error(content)
      case 'debug':
        return this.debug(content)
      case 'warn':
        return this.warn(content)
      case 'fatal':
        return this.fatal(content)
    }
  }

  setLastLog(lastLineContent: any) {
    this.lastLineContent = lastLineContent.toString() as string
  }

  /**
   *
   * @param obj
   * @returns
   */
  info(obj: any) {
    this.setLastLog(obj)
    return this.logger.info(obj)
  }

  /**
   *
   * @param obj
   */
  error(obj: any) {
    this.setLastLog(obj)
    return this.logger.error(obj)
  }

  /**
   *
   * @param obj
   */
  debug(obj: any) {
    this.setLastLog(obj)
    return this.logger.debug(obj)
  }

  /**
   *
   * @param obj
   */
  warn(obj: any) {
    this.setLastLog(obj)
    return this.logger.warn(obj)
  }

  /**
   *
   * @param obj
   */
  fatal(obj: any) {
    this.setLastLog(obj)
    return this.logger.fatal(obj)
  }
}
