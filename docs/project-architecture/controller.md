# Controller

A controller is an injectable, which acts as a gateway for HTTP requests. To define a controller, you must use the `@Controller` decorator in this way:

```typescript
import { Controller } from '@kodexo/common'

@Controller('/cars')
export class CarsController {}
```

But there is no route linked to this controller, prefixed with `/cars`. This is the purpose of the routing decorators that are applied to the controller methods.

## Routing

To create routes, Kodexo provides several routing decorators that correspond to the different HTTP methods that exist: `@Get() @Post() @Put() @Patch() @Delete()`. Each of these decorators takes as parameter a sub-route, knowing that it is compatible with `regexparams`. Decorators are applied to methods that can be synchronous or asynchronous (and therefore be promises).

```typescript
import { Get, Post, Put, Patch, Delete, Controller } from '@kodexo/common'

@Controller('/cars')
export class CarsController {
  @Get('/')
  getCars() {
    // Logic to get cars from service for example
    return []
  }

  @Get('/:id')
  async getCar() {
    // Logic to get a specific car...
    return {}
  }

  @Post('/')
  createCar() {
    // Logic to create a car...
    return {}
  }

  @Put('/:id')
  async replaceCar() { // Can be async
    return {}
  }

  @Patch('/:id') // Usage of regexparams
  updateCar() {
    return {}
  }

  @Delete('/:id')
  deleteCar() {
    return {}
  }
}
```

Now let's see how to get the input parameters of our different routes.

## Parameters

If we take the previous example, we have parameters (`:id`) in our routes but we can't exploit them. We can't exploit the data passed in the `body` of the requests either.

There are several decorators that apply to the parameters of the decorator methods. They allow access to the information provided by the HTTP engine compatible with Express. Let's see which ones and how they are used:

| Decorator | Description |
| --------- | ------------- |
| `@Req()` | access to the object `req` (express) |
| `@Res()` | access to object `res` (express) |
| `@RouteParams(key?: string)` | access to `req.params` or `req.params[key]` |
| `@QueryParams(key?: string)` | access to `req.query` or `req.query[key]` |
| `@BodyParams(key?: string)` | access to `req.body` or `req.body[key]` |

Let's go back to the previous example:

```typescript
import {
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Controller,
  Request,
  Req
  RouteParams,
  BodyParams
} from '@kodexo/common'

@Controller('/cars')
export class CarsController {
  @Get('/')
  getCars(@Req() req: Request) {
    return []
  }

  @Get('/:id')
  async getCar(@RouteParams('id') id: string) {
    // We can use the var id now
    return {}
  }

  @Post('/')
  createCar(@BodyParams() body: any) { // We will see later how to apply a DTO
    return {}
  }

  @Put('/:id')
  async replaceCar(@RouteParams('id') id: string) {
    return {}
  }

  @Patch('/:id')
  updateCar(@RouteParams('id') id: string) {
    return {}
  }

  @Delete('/:id')
  deleteCar(@RouteParams('id') id: string) {
    return {}
  }
}
```

## Responses

As you can see, the methods of the controllers can be synchronous or asynchronous. Ideally, remember to always return a javascript object.

:::tip
You can also change the HTTP code of your return using the `@Status(xxx)` decorator, xxx being your code, in addition to your HTTP method decorator.
:::
