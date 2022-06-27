# Error Handling

With Kodexo, we added a `@kodexo/errors` package to handle errors and unify the type of returns in the API responses. Also, we have set up development errors to highlight what is the developer's responsibility.

## HTTP Errors

Rather than `throw` a classic `Error`, we invite you to use the package in this way:

```typescript
import { HttpError } from '@kodexo/errors'
import { Service } from '@kodexo/common'

@Service()
export class CarsService() {

  async getCar(id: string) {
    try {
      // find business logic
    } catch (error) {
      throw HttpError.NotFound(`Car not found`)
    }
  }
}
```
