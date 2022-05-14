import { BaseEntity } from '@kodexo/crud'
import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { User } from '../../users/entities/user.entity'

@Entity()
export class Car extends BaseEntity<Car> {
  @Property()
  name: string

  @ManyToOne(() => User)
  owner: User
}
