# Middlewares & Interceptors

In fact, middleware and interceptors are exactly the same thing: they are injectables that have a certain interface to correspond to an express `middleware`.

## Middlewares

The middlewares are Kodexo are very often used in the following cases:
- data validation
- authentication & access control
- logging

They run **before** the method in your controllers and are applied to them using the `@Use` decorator which we will see next.

To create your first middleware, you must respect the following implementation:

```typescript
import {
  Request,
  Response,
  NextFunction,
  Middleware,
  MiddlewareHandling
} from '@kodexo/common'

@Middleware()
export class MyMiddleware implements MiddlewareHandling {
  constructor() {} // Inject your providers if they are needed

  async use(req: Request, res: Response, next: NextFunction) {
    // Do something on req or throw an error

    // Remember to call next() function to go further
    next()
  }
}
```

Then you have to apply it to your route on your controllers:

```typescript{7}
import { Use, Controller, Get } from '@kodexo/common'
import { MyMiddleware } from './middlewares/my-middleware'

@Controller('/cars')
export class CarsController {

  @Use(MyMiddleware)
  @Get('/')
  async getCars() {
    return []
  }
}
```

## Interceptors

Basically, interceptors are also middleware but they are applied after the response of your controllers' methods. They also share the same `MiddlewareHandling` interface.

Interceptors are generally used to modify the result before sending the response to the client.

```typescript
import {
  Request,
  Response,
  NextFunction,
  Interceptor,
  MiddlewareHandling
} from '@kodexo/common'

@Interceptor()
export class MyInterceptor implements MiddlewareHandling {
  constructor() {} // Inject your providers if they are needed

  async use(req: Request, res: Response, next: NextFunction) {
    req.result = req.result.map((car: any) => {
      return {
        ...car,
        price: car.price * 1.1
      }
    })

    // Remember to call next() function to go further
    next()
  }
}
```
