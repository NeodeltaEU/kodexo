# Service

A service is the basic injectable. It contains the business logic of the feature to which it is attached. Of course, we can subdivide our services in the same feature for more clarity.

This is how you initialize a Service:

```typescript
import { Service } from '@kodexo/common'

@Service()
export class CarsService {
  async getCars() {
    return []
  }
}
```

:::warning
We must remember to register our service in our feature module. Don't forget that the IoC and dependency injection system will not be able to solve your service.
:::

Next, let's see how to use a service (and more generally an injectable) in another service, a controller or in a class external to the IoC system.

## Injection

In a controller or a service, it is quite similar:

```typescript
import { Inject } from '@kodexo/injection'
import { Controller, Service } from '@kodexo/common'

@Controller('/cars')
class CarsController {
  constructor(@Inject private carsService: CarsService) {}
}

@Service()
class GaragesController {
  constructor(@Inject private carsService: CarsService) {}
}
```

But in a class that is not injectable or part of the inversion system, let's see together how a service (or injectable) is called:

```typescript
class MyExternalClass {
  @Inject private carsService: CarsService
}
```

:::warning
But remember that potentially the provider building system can take a long time when starting the app. Make sure that your external class is called after your app's providers are resolved.
:::
