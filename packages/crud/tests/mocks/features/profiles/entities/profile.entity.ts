import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'

@Entity()
export class Profile {
  @PrimaryKey()
  id: string = v4()

  @Property()
  private: boolean = false
}
