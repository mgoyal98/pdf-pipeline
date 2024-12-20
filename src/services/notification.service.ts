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
      logger.error('[NotificationService] Error sending notification:', error);
      throw error;
    }
  }

  private async sendToWebhook(opts: IHttpSendOpts) {
    try {
      logger.info('[NotificationService] Hitting webhook', {
        url: opts.url,
      });
      await axios.post(opts.url, opts.body, {
        headers: {
          'Content-Type': 'application/json',
          ...opts.headers,
        },
      });
    } catch (error: any) {
      const errMessage = `${error?.response?.status} ${error?.response?.statusText}`;
      const axiosErr = error?.response?.data ? new Error(errMessage) : error;
      if (error?.response?.data) {
        logger.error('[NotificationService] Error hitting webhook:', {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          message: errMessage,
        });
      } else {
        logger.error('[NotificationService] Error hitting webhook:', axiosErr);
      }
      throw axiosErr;
    }
  }
}
