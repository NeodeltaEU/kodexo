import { Job } from 'bullmq'

export interface QueueHandler {
  processor(job: Job): Promise<any>

  onFailed?(): Promise<any>
  onCompleted?(): Promise<any>
  onDrained?(): Promise<any>
}
