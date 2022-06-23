# Serialize outputs

As such, our feature has the minimum required to run properly. But it is strongly recommended to apply serialization to output objects. This is how you can clean up output data, modify it, hide some of it depending on the context, etc. It is also at the serialization level that we can declare our OpenAPI specifications.

:::info
Like DTOs, serialized outgoing objects are handled by [class-transformer](https://github.com/typestack/class-transformer).
:::

Let's create our first serialization class together. Start by creating a `serializations` folder in your feature. Next we create the file `src/features/cars/serializations/car.serialized.ts`:

```typescript
import { BaseSerialized } from '@kodexo/crud'
import { Expose, Transform } from 'class-transformer'

export class CarSerialized extends BaseSerialized {
  @Transform(({ value }) => value.toUpperCase())
  label: string

  @Expose({ name: 'masterBrand' })
  brand: string

  @Expose()
  mileage: number

  @Expose()
  get kilometerage() { // english neologisms are possible
    return this.mileage * 1.609344
  }
}
```

You can see that here we do several things (which don't necessarily make much sense but serve as an example):
- we transform the `label
- we rename `brand` to `masterBrand`.
- we have removed the `model` which will not appear on any of our routes
- we added a `getter` to know the number of km calculated on the mileage.

:::warning
Note that if you do not want to apply any modification to a field, you must use the `@Expose` decorator of `class-transformer`.
:::

We just need to add this serialization class to the `@Crud` decorator of our controller. Here we go:

```typescript
@CrudController('/cars', {
  model: Car,
  // Add serialization here
  serialization: CarSerialized,
  dto: {
    createDto: CreateCarDto,
    updateDto: UpdateCarDto
  }
})
```

And it's all good, we just have to test everything we did!
