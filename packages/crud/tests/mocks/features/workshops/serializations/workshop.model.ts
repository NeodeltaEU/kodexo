import { Expose } from 'class-transformer'

export class WorkshopModel {
  @Expose()
  id: string

  @Expose()
  title: string

  @Expose()
  street: string | null

  @Expose()
  postalCode: string | null

  @Expose()
  city: string | null

  @Expose()
  country: string | null
}
