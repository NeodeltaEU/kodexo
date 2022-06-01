import { Registry } from '../main'

export interface OnProviderInit {
  onProviderInit(providerRegistry: Registry): Promise<void>
}
