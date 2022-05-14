import { Expose } from 'class-transformer'

export abstract class BaseSerialized {
  @Expose()
  id: string

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date
}
