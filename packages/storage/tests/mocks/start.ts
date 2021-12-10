import { App } from '@uminily/app'
import { Server } from './Server'

async function bootstrap() {
  await App.bootstrap(Server)
}

bootstrap()
