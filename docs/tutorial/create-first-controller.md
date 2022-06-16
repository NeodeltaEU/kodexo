# Create first Controller

Now let's look at the entrance to our feature. A `Controller` is a set of routes defined under a single common sub-route.

By convention, we assume that there is only one controller per feature, so we will name our file: `src/features/cars/cars.controller.ts` (always plural and with the suffix `.controller`).

Here is the minimum content for a controller, we will make it evolve as we go along here:

```typescript
import { Controller } from '@kodexo/common'

@Controller('/cars')
export class CarsController {}
```

It's pretty simple. Our controller is self-registered by the configuration of the `AppModule`, no need here to add it to the Module.

As we can see, the `@Controller` decorator only takes a single sub-route as a parameter, from which all routes here will be inherited. But as you can see, there is currently no route registered on this controller, so we will create one first.

```typescript
import { Controller, Get } from '@kodexo/common'

@Controller('/cars')
export class CarsController {

  @Get('/models')
  async getModels() {
    return [
      'Mercedes',
      'Ford',
      'Toyota',
      'Volkswagen',
      'Renault',
      'Fiat',
      'Nissan'
    ]
  }
}
```

If your development server is started, you should be able to test the `/cars/models` route and see the JSON return. Congratulations, you have created your first controller and your first route!

:::info
Reminder: to start your development server, just use the command `npm run dev` or `yarn dev`.
:::
