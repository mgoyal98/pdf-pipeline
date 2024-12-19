import { NotificationType } from 'src/enums/notification';

export interface IQueueConfig {
  name: string;
  queueUrl: string;
  templatePath: string;
  outputBucket: string;
  outputPath: string;
  pollingDelay: number;
  notificationConfig: {
    type: NotificationType;
    destination: string;
    headers?: Record<string, string>;
  };
}
