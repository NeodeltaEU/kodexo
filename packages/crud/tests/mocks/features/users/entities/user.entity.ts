import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'
import { LimitPopulate } from '../../../../../src/decorators/LimitPopulate'
import { Car } from '../../cars/entities/car.entity'
import { Dealership } from '../../dealerships/entities/dealership.entity'
import { LimitInvoicePopulateLimiter } from '../populates/limit-invoice.populate'
import { Invoice } from './invoice.entity'

@Entity()
export class User {
  @PrimaryKey()
  id: string = v4()

  @Property()
  email!: string

  @Property({ nullable: true })
  lastname: string

  @Property({ nullable: true, hidden: true })
  password: string

  @OneToMany(() => Car, car => car.owner)
  cars = new Collection<Car>(this)

  @ManyToMany(() => Dealership, dealership => dealership.customers, { owner: true })
  favoriteDealerships = new Collection<Dealership>(this)

  @OneToMany(() => Invoice, invoice => invoice.user)
  @LimitPopulate(LimitInvoicePopulateLimiter)
  invoices = new Collection<Invoice>(this)
}
