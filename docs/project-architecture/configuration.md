# Configuration

The configuration is very simple on a Kodexo application, it is a simple JS object. So it can be dynamic and/or overridable, you can use env variables via `process.env`. Remember to import the `@kodexo/config` package.

## Base configuration

We usually create a `src/config.ts` file that exports the configuration to the `@Configuration` decorator applied to the `Server` class.

Here is an example of a minimal configuration:

```typescript
import { ServerConfiguration } from '@kodexo/config'
import { AppModule } from './app.module'

export const config: ServerConfiguration = {
  appModule: AppModule,
  port: 5000
}
```

And to apply it to the Server:

```typescript
import { Configuration } from '@kodexo/config'
import { config } from './config'

@Configuration(config)
export class Server{}
```

And that's all. The configuration is now applied and available to your entire application.

## Access to config

To access certain objects or keys in your configuration, we recommend that you avoid importing this configuration file directly but use the `ConfigurationService` that you can inject anywhere in your application.

This ConfigurationService provides two public methods that are very convenient: `.get(keyPath)` and `.getOrFail(keyPath)`. Let's see how to use it:

```typescript
export class MyService {
  constructor(@Inject private config: ConfigurationService) {}

  myMethod() {
    const myKeyNotMandatory = this.config.get('myObjectConf.myObjectConfKey') // returns true
    const myKeyMandatory = this.config.getOrFail('myObjectConf.secondKey') // throws an error
  }
}

// Based on this config object:
const config = {
  port: 4000,

  myObjectConf: {
    myObjectConfKey: true
  }
}
```
