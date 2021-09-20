import { Worker, ConnectionOptions, WorkerOptions, Queue, QueueOptions } from 'bullmq'
import { Service } from '@uminily/common'
import { ConfigurationService } from '@uminily/config'
import { Inject, providerRegistry } from '@uminily/injection'
import { QueueProvider } from '../components/QueueProvider'
import { QueueHandler } from '../interfaces'
import { Class } from 'type-fest'

@Service()
export class QueueManager {
  private currentWorkers: Map<string, Worker> = new Map()
  private currentQueues: Map<string, Queue> = new Map()
  private bullConnection: ConnectionOptions
  private queuePrefix: string

  constructor(@Inject private configurationService: ConfigurationService) {
    this.bullConnection = this.configurationService.getOrFail('bull')
    this.queuePrefix = this.configurationService.get('queue.prefix')
  }

  /**
   *
   */
  prepareQueues() {
    Array.from(providerRegistry.queues.values()).forEach(queueProvider => {
      const { queueName, token } = queueProvider as QueueProvider

      const config: QueueOptions = {
        connection: this.bullConnection
      }

      const name = (this.queuePrefix ? this.queuePrefix : '') + queueName

      const queue = new Queue(name, config)

      this.currentQueues.set(token.name, queue)
    })
  }

  /**
   *
   */
  startAllWorkers() {
    Array.from(providerRegistry.queues.values()).forEach(queueProvider => {
      const { queueName, instance } = queueProvider as QueueProvider

      const config: WorkerOptions = {
        connection: this.bullConnection
      }

      const name = (this.queuePrefix ? this.queuePrefix : '') + queueName

      const worker = new Worker(name, instance.processor, config)

      this.currentWorkers.set(instance.constructor.name, worker)
    })
  }

  /**
   *
   */
  stopAll() {
    this.currentWorkers.forEach(worker => worker.close())
  }

  /**
   *
   */
  async addJob(queue: Class<QueueHandler>, jobName: string, jobParams?: any) {
    const foundQueue = this.currentQueues.get(queue.name)

    if (!foundQueue) throw new Error(`Queue "${queue.name}" not found or not registered.`)

    await foundQueue.add(jobName, jobParams)
  }
}
