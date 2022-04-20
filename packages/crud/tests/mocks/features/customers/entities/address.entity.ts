import { Embeddable, Property } from '@mikro-orm/core'

@Embeddable()
export class Address {
  @Property()
  street: string

  @Property()
  city: string

  @Property()
  postalCode: string
}
