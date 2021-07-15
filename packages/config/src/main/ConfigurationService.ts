import { Service } from '@uminily/common'
import * as objectPath from 'object-path'
import { PartialDeep } from 'type-fest'

@Service()
export class ConfigurationService {
  protected storage: PartialDeep<Kodexo.Configuration> = {}

  /**
   *
   * @param configuration
   */
  applyConfig(configuration: PartialDeep<Kodexo.Configuration>) {
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
