# Register to module

Now that we have our first entity and our first service, we will create a module linked to the feature and register our first two elements.

A module registers and groups a set of injectables and services.The module also takes care of importing and resolving the modules and/or other injectables (i.e. the modules are themselves injectables) on which it would depend. The dependency injection system will resolve the different instances according to the prerequisites of the modules and the links between them.

Let's create our module together. The file will be named and placed by convention here: `src/features/cars/cars.module.ts` (plural and at the root of the feature folder). Here is how it is built:

```typescript
import { Module } from '@kodexo/common'
import { Car } from './entities/car.entity'
import { CarsService } from './services/cars.service'

@Module({
  providers: [CarsService],
  entities: [Car]
})
export class CarsModule {}
```

As we can see, the `CarsModule` class is very simple and consists in having only one `@Module` decorator which is much more interesting. This decorator takes a relatively simple configuration in our case:
- `providers`: an array of `Injectable` & `Service` classes, injectables that will then be registered to this module and now available in the dependency injection system.
- `entities`: an array of MikroORM `Entity` classes to register our entities to the MikroORM service upstream.

Our module is now ready.
