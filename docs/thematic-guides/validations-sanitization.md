# Validations & Sanitizations

Kodexo integrates a middleware that allows to check the DTO on the body of the requests. Since DTOs are based on class-transformer and class-validator, our middleware integrates this technology exclusively.

To use validation and potentially sanitize the input data on a controller route, a DTO must first be created:

```typescript
import { IsString } from 'class-validator'

export class MyDTO {
  @IsString()
  myFirstData: string
}
```

And to apply it to your route on a controller, nothing could be easier:

```typescript
...
  @UseValidation(MyDTO)
  @Post('/my-route')
  async myAction(@BodyParams() body: MyDTO) {
    ...
  }
...
```

If the input body does not exactly match your DTO, the validation middleware will return an HTTP 422 error.
