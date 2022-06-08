import { SoftDelete } from '@kodexo/mikro-orm'
import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'
import { Car } from '../../cars/entities/car.entity'
import { User } from '../../users/entities/user.entity'

@SoftDelete()
@Entity()
export class Dealership {
  @PrimaryKey()
  id: string = v4()

  @Property()
  title!: string

  @OneToMany(() => Car, car => car.dealership)
  cars = new Collection<Car>(this)

  @ManyToMany(() => User, user => user.favoriteDealerships)
  customers = new Collection<User>(this)

  @Property({ nullable: true })
  deletedAt?: Date
}
