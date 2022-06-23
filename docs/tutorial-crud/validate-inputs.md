# Validate Inputs

We want to create and update new database entries to register cars.

## Create our first DTO

To prevent end users from sending wrong data, we will add an input data format. To do this, we will create what is called a DTO ([Data Transfert Object](https://en.wikipedia.org/wiki/Data_transfer_object)).

A DTO is an object that contains the input data of a route, it is the source of truth about the sent data. Together with validation & sanitization decorators, our DTO will transport the validated or modified data to the inspector who will check if the data sent is in accordance with the initial declaration of the DTO.

:::tip
Kodexo DTOs rely on the [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer) libraries for validation and sanitization. If you want to know all the possibilities related to these libraries, look at their documentations, they are really very powerful.
:::

For our CRUD, we will first seek to secure our `Create` action. Let's create our dto `src/features/cars/dto/create-car.dto.ts`:

```typescript
import { IsString, IsIn, IsInt } from 'class-validator'

// We could use this in a service to share this kind 
// of information between the controller and our validations.
// Go to Dependency Injection / Validations & Sanitizations.
const brands = [
  'Mercedes',
  'Ford',
  'Toyota',
  'Volkswagen',
  'Renault',
  'Fiat',
  'Nissan'
]

export class CreateCarDto {
  @IsString()
  label: string

  @IsString()
  model: string

  @IsIn(brands)
  brand: string

  @IsInt()
  mileage: number
}
```

That's it. You have an object-oriented representation of your input data with validations via decorators. Very easy to use.

Now let's go secure our Create route. Let's take our controller and add a parameter to the `@Crud` decorator:

```typescript
import { CrudController, CrudControllerInterface } from '@kodexo/crud'
import { Inject } from '@kodexo/injection'
import { Car } from './entities/car.entity'
import { CarsService } from './services/cars.service'
import { CreateCarDto } from './dto/create-car.dto'

@CrudController('/cars', {
  model: Car,
  // Add dto param here
  dto: {
    createDto: CreateCarDto
  }
})
@Controller('/cars')
export class CarsController implements CrudControllerInterface<Car> {
  constructor(@Inject public service: CarsService) {}

  @Get('/brands')
  async getBrands() {
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

And here is the create route is now secured. We will test it at the end.

## Secure the entity update

We know how to make a DTO, making a second one will be a breeze, so let's go. We create a new file `src/features/cars/dto/update-car.dto.ts`:

```typescript
import { IsString, IsInt } from 'class-validator'

export class UpdateCarDto {
  @IsString()
  label?: string

  @IsInt()
  mileage?: number
}
```

It is the same thing, except that some fields have been removed. These can never be updated.

It should be noted that on a DTO that is placed as an update DTO, all fields are optional by default. If a field is absolutely required during the update, consider using the following `class-validator` decorator: `@IsDefined()`

:::tip
You can do inheritance between your DTOs, validation/sanitization will still apply. Very useful when you want to create and update the same fields. We usually create an abstract dto that we call `CommonMyFeature`.
:::

As we did before, we just add our DTO to the `@Crud` decorator of our controller as a parameter:

```typescript
@CrudController('/cars', {
  model: Car,
  dto: {
    createDto: CreateCarDto,
    // Add dto here
    updateDto: UpdateCarDto
  }
})
```

Our entrance routes are now secured & cleaned.
