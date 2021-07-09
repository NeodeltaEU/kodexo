import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'
import { Dealership } from '../../dealerships/entities/dealership.entity'
import { User } from '../../users/entities/user.entity'

@Entity()
export class Car {
  @PrimaryKey()
  id: string = v4()

  @Property()
  title!: string

  @Property({ nullable: true })
  doors: number

  @Property({ nullable: true })
  registeredAt: Date

  @ManyToOne(() => Dealership, { nullable: true })
  dealership!: Dealership

  @ManyToOne(() => User, { nullable: true })
  owner!: User
}
