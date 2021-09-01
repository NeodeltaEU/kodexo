import { AppWorker } from '../../src'
import { Server } from './server'

async function bootstrap() {
  return AppWorker.bootstrap(Server)
}

bootstrap()
