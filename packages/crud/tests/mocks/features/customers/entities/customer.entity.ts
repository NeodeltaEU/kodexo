import { Embedded, Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'
import { Address } from './address.entity'

@Entity()
export class Customer {
  @PrimaryKey()
  id: string = v4()

  @Property()
  name!: string

  @Embedded(() => Address)
  address!: Address
}
