import {
  Worker,
  ConnectionOptions,
  WorkerOptions,
  Queue,
  QueueOptions,
  FlowProducer,
  Job,
  FlowJob
} from 'bullmq'
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
  private currentFlowProducer: FlowProducer
  private bullConnection: ConnectionOptions
  private queuePrefix: string

  constructor(@Inject private configurationService: ConfigurationService) {
    this.bullConnection = this.configurationService.getOrFail('bull')
    this.queuePrefix = this.configurationService.get('queues.prefix')
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
  startFlowProducer() {
    const config: QueueOptions = {
      connection: this.bullConnection
    }

    this.currentFlowProducer = new FlowProducer(config)
  }

  /**
   *
   */
  listen() {
    this.startAllWorkers()
    this.startFlowProducer()
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
  async addJob(params: JobParams) {
    const { queue, jobName, jobData } = params

    const foundQueue = this.currentQueues.get(queue.name)

    if (!foundQueue) throw new Error(`Queue "${queue.name}" not found or not registered.`)

    await foundQueue.add(jobName, jobData)
  }

  /**
   *
   * @param parentQueue
   */
  async addJobFlow(params: JobFlowParams) {
    const resolveQueueNames = (leveledParams: JobFlowParams): FlowJob => {
      const { parentQueue: queue, jobName: name, jobData: data, children } = leveledParams

      const foundQueue = this.currentQueues.get(queue.name)

      if (!foundQueue) throw new Error(`Queue "${queue.name}" not found or not registered.`)

      return {
        name,
        data,
        queueName: foundQueue.name,
        children: children.map(child => resolveQueueNames(child))
      }
    }

    this.currentFlowProducer.add(resolveQueueNames(params))
  }
}

type JobParams = {
  queue: Class<QueueHandler>
  jobName: string
  jobData?: any
}

type JobFlowParams = {
  parentQueue: Class<QueueHandler>
  jobName: string
  jobData?: any
  children: JobFlowParams[]
}
