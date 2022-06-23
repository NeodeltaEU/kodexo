# Global Architecture

A Kodexo application is globally composed of injectable classes. The injectable side is indeed common to controllers, services, middleware, modules etc. After that we add some other dependencies (eg. Models, Subscribers...) on which we rely to build robust and powerful applications, but the base remains the controllers and the services.

## Differents packages

Kodexo is built with several packages that each have more or less responsibility. Remember to import them into your project. Here are the main ones:
- `@kodexo/common`: contains the basic decorators to create your application.
- `@kodexo/injection`: this package allows to register all your providers, to load files and to inject dependencies
- `@kodexo/app`: contains the tinyhttp part and allows to build the routes.
- `@kodexo/config`: is the base package for everything related to the configuration files of the package set, there is a very handy service: `ConfigurationService`.
- `@kodexo/logger`: contains a service to log and format the logs of your applications.
- `@kodexo/errors`: collects and formats HTTP errors and development/non-compliance errors
- `@kodexo/crud`: allows to exploit Mikro-ORM models and to create routes automatically on controllers.


## Controller

A controller is a singleton instantiated at the end of the set of providers. It is the ultimate point to define the routes of our applications.

```typescript
import { Controller, Get } from '@kodexo/common'

@Controller('/houses')
export class HousesController {

  @Get('/')
  async getHouses() {
    return [
      {
        name: 'Main House'
      },
      {
        name: 'Vacation Home'
      }
    ]
  }
}
```

These are really the HTTP entry points for our applications. Knowing that they are the entry points, the majority of the security of our applications will also be found at the level of the controllers.

:::tip
We prefer to create one controller per feature than to create huge controllers that contain several dozen routes. The principle of single responsibility also applies to them.
:::

## Service

Services, like controllers, are also instantiated classes. We say that they are injectables and encapsulated in providers that allow to solve dependency injection. Most of the time, they are called by each other or directly by the controllers.

```typescript
import { Service } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { RoadsService } from './roads.service'


@Service()
export class HousesService {
  constructor(@Inject roadsService: RoadsService) {}

  getRoadDetailsForHouse(houseId: string) {
    const { road } = this.getHouse(houseId)
    return this.roadsService.getRoad(road)
  }

  getHouse(houseId) {
    return {
      road: 'Main Road'
      ...
    }
  }
}
```

And now you can use it in your controller:

```typescript
import { Controller, Get } from '@kodexo/common'
import { Inject } from '@kodexo/injection'
import { HousesService } from './services/houses.service'

@Controller('/houses')
export class HousesController {
  constructor(@Inject housesService: HousesService) {}

  @Get('/')
  async getHouses() {
    return [
      {
        name: 'Main House'
      },
      {
        name: 'Vacation Home'
      }
    ]
  }

  @Get('/:id/road')
  async getRoadOfHouse(@RouteParams('id') houseId: string) {
    return this.housesService.getRoadDetailsForHouse(houseId)
  }
}
```

:::warning
Remember to save all your injectables in your modules and to import your modules between them as needed.
:::

Now you know the basic architecture of Kodexo applications.
