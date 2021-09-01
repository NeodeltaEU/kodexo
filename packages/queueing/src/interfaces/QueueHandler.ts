import { Job } from 'bullmq'

export interface QueueHandler {
  processor(job: Job): Promise<any>
}
