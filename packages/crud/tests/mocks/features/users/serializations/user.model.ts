import { Expose } from 'class-transformer'
import { CarModel } from '../../cars/serializations/car.model'
import { DealershipModel } from '../../dealerships/serializations/dealership.model'
import { InvoiceModel } from './invoice.model'

export class UserModel {
  @Expose()
  id: string

  @Expose()
  email: string

  @Expose()
  lastname: string | null

  @Expose()
  cars: CarModel[]

  @Expose()
  favoriteDealerships: DealershipModel[]

  @Expose()
  invoices: InvoiceModel[]
}
