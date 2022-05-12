import { BaseEntity } from '@kodexo/crud'
import { Entity, Property } from '@mikro-orm/core'

@Entity()
export class User extends BaseEntity<User> {
  @Property()
  email: string

  @Property()
  password: string
}
