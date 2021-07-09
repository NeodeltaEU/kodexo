import { Embeddable, Embedded, Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'

@Entity()
export class Workshop {
  @PrimaryKey()
  id: string = v4()

  @Property()
  title!: string

  @Property({ nullable: true })
  street!: string

  @Property({ nullable: true })
  postalCode!: string

  @Property({ nullable: true })
  city!: string

  @Property({ nullable: true })
  country!: string
}
