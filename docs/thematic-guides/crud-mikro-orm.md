# CRUD & Mikro-ORM

## Mikro-ORM

With Kodexo, we chose to use only one MRO. Our choice was MikroORM, which seems to us to be the best compromise compared to TypeORM, which many people complain about (rightly or wrongly), or Prisma, which seems to us to be one of the best ORMs currently on the market (especially for its very strong TS compatibility) but which seemed to us to be too rigid in its use and implementation.

So we created a package that mainly contains a Service named `ConnectionDatabase` (yes, there is no Service suffix). It is this service that will interest you. Let's see how to use it.

### Installation

Whether you want to use it within the automatic CRUD system, or in stand-alone, remember to import the `@kodexo/mikro-orm` package and to install the `@mikro-orm/core` & `@mikro-orm/postgresql` packages (currently in version 5.2.x).

Once installed, remember to add the module `MikroModule` in your `AppModule`.

### Configuration

We will then configure Mikro ORM directly in our configuration file. To do this, add a `mikroORM` key to your `Configuration`. This key corresponds exactly to the typing and configuration of [Mikro-ORM](https://mikro-orm.io/docs/configuration). Be careful though, **you won't need to import the entities**, this configuration is done in your Feature Modules. We will see it right after. We will see it later but for the moment here is an example of configuration:

```typescript
const config: Configuration = {
  mikroORM: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5400'),
    dbName: process.env.DB_NAME || 'dbName',
    user: process.env.DB_USER || 'dbUser',
    password: process.env.DB_PASSWORD || 'dbPassword',
    type: 'postgresql',
    debug: false,
    loadStrategy: LoadStrategy.JOINED,
    driverOptions: {
      connection: {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      }
    }
  }
}
```

## Auto CRUD system

See tutorial.
