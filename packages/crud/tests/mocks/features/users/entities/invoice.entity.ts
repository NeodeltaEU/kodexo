import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'
import { User } from './user.entity'

@Entity()
export class Invoice {
  @PrimaryKey()
  id: string = v4()

  @Property()
  amount: number

  @ManyToOne({ entity: () => User, onDelete: 'CASCADE' })
  user: User
}
