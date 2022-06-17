# Register the feature

We have created our first module but it is not connected to our application. As we said before a module is an injectable, so we will simply add this module (and its related `providers`) to main app module.

:::tip
What is a `provider` ? It is a class that encapsulates your injectable and that allows the resolution of constructors and injections. For short, we often call an `injectable` a `provider`.
:::

Let's go, it's quite simple, let's take your main module (often at the root of the src folder). The file should look like this:

```typescript
import { controllersAutoDiscovery } from '@kodexo/app'
import { Module } from '@kodexo/common'
import { MikroModule } from '@kodexo/mikro-orm'
import { UsersModule } from './features/users.module'

@Module({
  routing: controllersAutoDiscovery(),
  imports: [MikroModule, UsersModule]
})
export class StarterCrudModule {}
```

Just import and add to the `imports` our newly created module: `CarsModule`. Don't forget to import it.

```typescript
@Module({
  routing: controllersAutoDiscovery(),
  imports: [MikroModule, UsersModule, CarsModule]
})
```

And that's it, your new API feature is registered on the application.
