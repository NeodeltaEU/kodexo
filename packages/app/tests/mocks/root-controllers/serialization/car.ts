import { Expose } from 'class-transformer'

export class CarModel {
  @Expose()
  id: number

  @Expose()
  model: string

  @Expose()
  registration: string
}
