export type RequestJob<T> = {
  event: string;
  trackingConsentMessageId: string;
  data?: Record<string, any>;
  flushEventBefore: boolean;
  cookieLess?: boolean;
  bucketID?: number;
  resolve?: (value: T | PromiseLike<T>) => void;
  reject?: (reason?: any) => void;
};

export class QueueManager<T> {
  private jobs: RequestJob<T>[] = [];
  private running = false;
  private waitingForBulk = false;
  private bulkTimeout;
  private isBucketOpen = false;
  private currentBucketID = 0;

  public callback: (job: RequestJob<T>[]) => Promise<T[]>;

  constructor(
    bulkTimeout: number,
    callback: (job: RequestJob<T>[]) => Promise<T[]>
  ) {
    this.bulkTimeout = bulkTimeout;
    this.callback = callback;
  }

  openBucket() {
    this.currentBucketID++;
    this.isBucketOpen = true;
    this.runQueue();
  }

  closeBucket() {
    this.isBucketOpen = false;
    this.runQueue();
  }

  enqueueJob(job: RequestJob<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      job.reject = reject;
      job.resolve = resolve;
      if (this.isBucketOpen) {
        job.bucketID = this.currentBucketID;
      } else {
        job.bucketID = -1;
      }
      this.jobs.push(job);
      if (this.isBucketOpen) {
        return;
      }
      if (!this.running && !this.waitingForBulk) {
        this.waitingForBulk = true;

        setTimeout(() => {
          this.waitingForBulk = false;
          this.runQueue();
        }, this.bulkTimeout);
      }
    });
  }

  private async runQueue(): Promise<void> {
    this.running = true;
    while (this.jobs.length > 0) {
      const jobs: RequestJob<T>[] = [];

      let bucketID = -1;

      while (this.jobs.length > 0) {
        if (jobs.length === 0) {
          const bid = this.jobs[0]?.bucketID;
          if (bid) {
            bucketID = bid;
            const job = this.jobs.shift();
            if (job) {
              jobs.push(job);
            }
          }
        } else {
          let job = this.jobs[0];
          if (job) {
            if (
              job.cookieLess ||
              job.flushEventBefore ||
              job.bucketID !== bucketID
            ) {
              break;
            } else {
              job = this.jobs.shift();
              if (job) {
                jobs.push(job);
              }
            }
          }
        }
      }

      try {
        const result = await this.callback(jobs);

        for (const i in result) {
          const r = result[i];
          if (r) {
            const job = jobs[i];
            if (job?.resolve) {
              job.resolve(r);
            }
          }
        }
      } catch (error) {
        jobs.forEach((j) => {
          if (j.reject) {
            j.reject(error);
          }
        });
      }
    }
    this.running = false;
  }
}
