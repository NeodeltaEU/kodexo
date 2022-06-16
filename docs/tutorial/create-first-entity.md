# Create first Entity

As we have already said, the important thing for an API is to know the business well and to define our entities as well as possible.

Our Car entity will have several fields that we want to persist in the database:
- a label for the user
- a model
- a brand
- a mileage

Let's see how to create this first entity file in `src/features/cars/entities/car.entity.ts` (you can see that we have created a folder named `entities` by convention and the entity is singular, followed by `.entity`). Here is the Car entity:

```typescript
import { BaseEntity } from '@kodexo/crud'
import { Entity, Property } from '@mikro-orm/core'

@Entity()
export class Car extends BaseEntity<Car> {
  @Property()
  label: string

  @Property()
  model: string

  @Property()
  brand: string

  @Property()
  mileage: number
}
```

We can see that `Car` extends from `BaseEntity` (not from MikroORM but from Kodexo). This `BaseEntity` adds several fields including the following: 
- `id` generated via uuid
- `createdAt`
- `updatedAt`
- `deleteAt` nullable by default

::: tip
If you want to see how to customize your entities even more, we invite you to have a look at the [documentation of MikroORM](https://mikro-orm.io) which is a great tool and certainly one of the most powerful Typescript ORM on the market today. We love the principle of UoW.
:::

We have just created our first MikroORM entity. This lib will offer us several tools to prepare the migrations or go further and update directly the tables in the database. Let's leave this aside for the moment and continue implementing our first feature.
