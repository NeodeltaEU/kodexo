# Create related Service

A `Service`, in Kodexo, is an Injectable class which will therefore work via the dependency injection system. Services are the business part of our applications. They contain the business logic and interact with the repositories.

Now we will create our first service linked to an entity. By convention, we place this file in a `services` folder and name it `src/features/cars/services/cars.service.ts`. You may notice that the feature name is always in the plural when it is an entity-feature.

Kodexo CRUD offers a service base that exposes the main CRUD actions, let's see it together:

```typescript
import { Service } from '@kodexo/common'
import { CrudService } from '@kodexo/crud'
import { Inject } from '@kodexo/injection'
import { ConnectionDatabase } from '@kodexo/mikro-orm'
import { Car } from '../entities/car.entity'

@Service()
export class CarsService extends CrudService<Car> {
  constructor(@Inject connection: ConnectionDatabase) {
    super(connection, User)
  }
}
```

A lot of things to explain in this piece of code. First, we need to register the service using the `@Service()` decorator. From there, our dependency injection system is aware that the service is an injectable and can build and populate its own dependencies.

About dependencies and injection, we can see that in the service constructor, we use another decorator, the `@Inject` which allows to populate the constructor variable with the instance of another service, in this case the database connection service via MikroORM.

:::tip
If needed, you can inject directly as a `private`, `public` or `protected` property your injectables: `constructor(@Inject private myService: MyService) {}`.
:::

The last point here is that we call `CrudService` which is the abstract service that exposes the methods for the base of a CRUD :

- `getOne`
- `getMany`
- `createOne`
- `updateOne`
- `deleteOne`
- `recovery`
