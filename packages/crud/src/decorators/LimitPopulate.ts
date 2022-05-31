import { getClass } from '@kodexo/common'
import { Store } from '@kodexo/injection'
import { Class } from 'type-fest'
import { PopulateLimiter } from '../components'

export function LimitPopulate(populateLimiterToken: Class<PopulateLimiter>) {
  return (target: any, propertyKey: string) => {
    Store.from(getClass(target), propertyKey).set('crud:limitPopulate', populateLimiterToken)
  }
}
