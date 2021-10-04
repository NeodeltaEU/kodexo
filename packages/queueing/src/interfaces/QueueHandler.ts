import { Job } from 'bullmq'

export interface QueueHandler {
  processor(job: Job): Promise<any>

  onFailed?(job: Job, failedReason: Error): Promise<any>
  onCompleted?(job: Job): Promise<any>
  onDrained?(): Promise<any>
  onActive?(job: Job, prev: string): Promise<any>
  onProgress?(job: Job, progress: number | object): Promise<any>
}
