import { Service } from '@kodexo/common'
import * as objectPath from 'object-path'
import { PartialDeep } from 'type-fest'
import { Inject } from '@kodexo/injection'
import { LoggerService } from '@kodexo/logger'

@Service()
export class ConfigurationService {
  protected storage: PartialDeep<Kodexo.Configuration> = {}

  constructor(@Inject private logger: LoggerService) {}

  /**
   *
   * @param configuration
   */
  applyConfig(configuration: PartialDeep<Kodexo.Configuration>) {
    this.logger.info(`[CONFIG] ${Object.keys(configuration).length} key config loaded`)
    this.storage = configuration
  }

  /**
   *
   * @param key
   * @returns
   */
  get(path: string) {
    return objectPath.get(this.storage, path)
  }

  /**
   *
   * @param path
   */
  getOrFail<T>(path: string): T {
    if (!objectPath.has(this.storage, path))
      throw new Error(`Path "${path}" is not found in current configuration`)

    return objectPath.get(this.storage, path) as T
  }

  /**
   *
   * @param key
   * @param value
   * @returns
   */
  set(path: string, value: any) {
    objectPath.set(this.storage, path, value)
  }
}
