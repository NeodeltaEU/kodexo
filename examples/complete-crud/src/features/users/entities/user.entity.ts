import { BaseEntity } from '@kodexo/crud'
import { Entity } from '@mikro-orm/core'

@Entity()
export class User extends BaseEntity<User> {}
