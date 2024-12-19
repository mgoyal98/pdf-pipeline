import axios from 'axios';
import { logger } from '../utils/logger';
import { NotificationType } from '../enums/notification';
import { SQSService } from './sqs.service';
import { INotificationNotifyOptions } from 'src/interfaces/notification';

export class NotificationService {
  private sqsService: SQSService;

  constructor() {
    this.sqsService = new SQSService();
  }

  async notify(opts: INotificationNotifyOptions) {
    try {
      if (opts.type === NotificationType.SQS) {
        await this.sqsService.sendMessage({
          queueUrl: opts.destination,
          body: opts.message,
        });
      } else if (opts.type === NotificationType.WEBHOOK) {
        await this.sendToWebhook(opts.destination, opts.message, opts.headers);
      }
    } catch (error) {
      logger.error('[NotificationService] Error sending notification:', error);
      throw error;
    }
  }

  private async sendToWebhook(url: string, message: any, headers?: any) {
    await axios.post(url, message, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  }
}
