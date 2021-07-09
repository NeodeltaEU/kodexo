import { Service } from '@neatsio/common'

@Service()
export class ConfigurationService {
  protected storage: Map<string, any> = new Map()

  applyConfig(configuration: Neatsio.Configuration) {
    Object.entries(configuration).forEach(([key, value]) => {
      this.set(key, value)
    })
  }

  get(key: string) {
    return this.storage.get(key)
  }

  set(key: string, value: any) {
    return this.storage.set(key, value)
  }
}
