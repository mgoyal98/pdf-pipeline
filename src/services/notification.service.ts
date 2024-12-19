import axios from 'axios';
import { logger } from '../utils/logger';
import { NotificationType } from '../enums/notification';
import { SQSService } from './sqs.service';
import { INotificationNotifyOptions } from 'src/interfaces/notification';
import { IHttpSendOpts } from 'src/interfaces/http';

export class NotificationService {
  private sqsService: SQSService;

  constructor() {
    this.sqsService = new SQSService();
  }

  async notify(opts: INotificationNotifyOptions) {
    try {
      logger.info(`[NotificationService] Sending notification`, {
        type: opts.type,
      });
      if (opts.type === NotificationType.SQS) {
        await this.sqsService.sendMessage({
          queueUrl: opts.destination,
          body: opts.message,
        });
      } else if (opts.type === NotificationType.WEBHOOK) {
        await this.sendToWebhook({
          url: opts.destination,
          body: opts.message,
          headers: opts.headers,
        });
      }
    } catch (error) {
      logger.error('[NotificationService] Error sending notification:', error, {
        type: opts.type,
      });
      throw error;
    }
  }

  private async sendToWebhook(opts: IHttpSendOpts) {
    await axios.post(opts.url, opts.body, {
      headers: {
        'Content-Type': 'application/json',
        ...opts.headers,
      },
    });
  }
}
