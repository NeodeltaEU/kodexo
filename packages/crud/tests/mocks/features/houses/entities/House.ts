import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'

@Entity()
export class House {
  @PrimaryKey()
  id: string = v4()

  @Property()
  address: string
}
