import { Job } from 'bullmq'
import { Queue, QueueHandler } from '../../../src'

@Queue('change-word')
export class ChangeWordQueue implements QueueHandler {
  async processor(job: Job) {
    console.log('consume')
    return 'onche'
  }
}
