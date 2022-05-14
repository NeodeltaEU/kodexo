import { BaseEntity } from '@kodexo/crud'
import { Entity, ManyToOne, Property } from '@mikro-orm/core'

@Entity()
export class User extends BaseEntity<User> {
  @Property()
  email: string

  @Property()
  password: string

  @ManyToOne(() => User, { nullable: true })
  partner: User
}
