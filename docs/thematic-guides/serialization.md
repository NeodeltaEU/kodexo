# Serialization

Like having basic middleware in Kodexo, there is an important interceptor that allows you to serialize your output objects from your routes.

Just like your input DTOs, your serialization objects are also subject to class-transformer rules.

```typescript
import { Expose, Transform } from 'class-transformer'

export class CarSerialized {
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

And to use it, again, it looks like some validations but with the `@UseSerialization` decorator in your controller:

```typescript
  @UseSerialization(CarSerialized)
  @Get('/my-cars')
  async getMyCars() {
    return [...]
  }
```

:::tip
As you can see on the last example, the method returns an array. The serialization interceptor detects if the result is an array and parse/serialize each element.
:::
