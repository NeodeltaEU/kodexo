# Module

A Module is an `@Injectable` but with the `@Module` decorator. The purpose of a Module is to organize the application, especially at the level of injectables, services etc. that are connected to one or more features of the app. Modules are singletons and instantiated only once, even if they are reused.

A Kodexo application, through its configuration file, must have a root-level application module. Often we name it with the project name followed by `Module` and we put it in the root of the `src/` folder.

## Structure of a module

The main purpose of the module is to reference all the injectables related to it. The decorator needs several parameters:

- `providers`: an array of injectables to be injected in the module.
- `imports`: an array of other modules (or injectables) to be imported in the module.
- `routing`: an object that allows you to map certain subroutes to specific controllers.

A module can also have other parameters, especially related to Mikro ORM:

- `entities`: an array of entities to be loaded in the module, they will be added to the Mikro ORM service when it starts.
- `subscribers`: an array of orm subscribers to be loaded in the module, they will be added to the Mikro ORM service when it starts.

```typescript
import { Module } from '@kodexo/common'
import { CarsController } from './cars.controller'
import { CarsService } from './services/cars.service'
import { RegistrationsModule } from '../registrations/registrations.module'

@Module({
  routing: {
    '/v1': [CarsController]
  },
  imports: [RegistrationsModule],
  providers: [CarsService],
})
export class CarsModule {}
```

## Feature & Common modules

By convention, you have seen that we have one file per feature. We invite you to create modules that are feature-scoped. A module should not contain too many injectables, it is again a matter of applying the principle of single responsability correctly.

If a module is to be shared between several modules or if its scope is sufficiently global, we invite you to create a module in the common folder or to create a separate package that you can import into one or more of your applications.
