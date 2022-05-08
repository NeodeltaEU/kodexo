import {
  AnyEntity,
  BaseEntity as MikroORMBaseEntity,
  Entity,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { v4 } from 'uuid'

@Entity({ abstract: true })
export abstract class BaseEntity<T extends AnyEntity> extends MikroORMBaseEntity<T, 'id'> {
  @PrimaryKey()
  id: string = v4()

  @Property({ defaultRaw: 'now()' })
  createdAt: Date = new Date()

  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Property({ nullable: true, hidden: true })
  deletedAt?: Date
}
