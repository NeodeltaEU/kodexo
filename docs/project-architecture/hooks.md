# Hooks

There are several types of hooks on Kodexo, those that are mainly used for services & DI, and those especially related to the Server startup. Let's see what they correspond to.

## Service/Injectable Hooks

### OnInit

When you create your service, sometimes you need to execute asynchronous methods (if you need to do synchronous things, we invite you to do it in the constructor). We have a decorator that applies to a method in your service `@OnInit()`, here is how to use it:

```typescript
import { OnInit } from '@kodexo/injection'
import { Service } from '@kodexo/common'

@Service()
export class DbService {
  private db: Database

  @OnInit()
  async init() {
    this.db = await Database.create()
  }

  getRepository(entity: string) {
    return this.db.getRepository(entity)
  }
}
```

### OnClose

Conversely, when your server is told to shut down (via a SIGTERM, for example), we may instruct some of our services to perform a method before shutting down (e.g. closing the connections to a database). The way it works is not very different from `@OnInit` but with `@OnClose`:

```typescript
import { OnInit, OnClose } from '@kodexo/injection'
import { Service } from '@kodexo/common'

@Service()
export class DbService {
  private db: Database

  @OnInit()
  async init() {
    this.db = await Database.create()
  }

  @OnClose()
  async close() {
    await this.db.close()
  }

  getRepository(entity: string) {
    return this.db.getRepository(entity)
  }
}
```

### OnProviderInit

There is one last hook, which is a little different because it doesn't use a decorator but is used through an interface called `OnProviderInit`. This interface requires our service to create an async method `onProviderInit(providerRegistry: Registry)` that allows access to all providers that are currently populated in the injection system.

This hook is mainly used for the resolution of services that are interdependent. Let's see it:

```typescript
import { Service } from '@kodexo/common'
import { Registry } from '@kodexo/injection'

@Service()
export class CarsService implements OnProviderInit {
  private garagesService: GaragesService

  onProviderInit(providerRegistry: Registry) {
    this.garagesService = providerRegistry.get(GaragesService)
  }
}

@Service()
export class GaragesService implements OnProviderInit {
  private carsService: CarsService

  onProviderInit(providerRegistry: Registry) {
    this.carsService = providerRegistry.get(CarsService)
  }
}
```

This hook is very useful in this case because it is executed just before the server is started, i.e. once all the providers have been initialized. Be careful not to use your imported services in your constructor as they will not be instantiated yet.

## Server Hooks

For the moment there is a hook on the server. We invite you on your class Server to apply the `ServerHooks` interface.

### AfterInit

This hook is executed once the server is instantiated, very useful to execute some stuff before the HTTP server is exposed on the web (e.g. execute migrations or apply database schemas). To use it, nothing could be easier:

```typescript
import { Configuration } from '@kodexo/config'
import { Inject } from '@kodexo/injection'
import { ConnectionDatabase } from '@kodexo/mikro-orm'
import { config } from './config'

@Configuration(config)
export class Server {
  constructor(@Inject private connection: ConnectionDatabase) {}

  async afterInit() {
    // apply here your migrations from your connection database service
  }
}
```
