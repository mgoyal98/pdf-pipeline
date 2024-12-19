import dotenv from 'dotenv';
import { NotificationType } from '../enums/notification';
import { IQueueConfig } from '../interfaces/config';

dotenv.config();

export const queuesConfig: IQueueConfig[] = [
  {
    name: 'invoice-queue',
    queueUrl: process.env.INVOICE_QUEUE_URL || '',
    templatePath: 'templates/invoice.html',
    outputBucket: process.env.INVOICE_PDF_BUCKET || '',
    outputPath: 'invoices',
    pollingDelay: 1000,
    notificationConfig: {
      type: NotificationType.WEBHOOK,
      destination: process.env.INVOICE_NOTIFICATION_URL || '',
      headers: {
        'x-api-key': process.env.INVOICE_NOTIFICATION_API_KEY || '',
      },
    },
  },
  {
    name: 'statement-queue',
    queueUrl: process.env.STATEMENT_QUEUE_URL || '',
    templatePath: 'templates/statement.html',
    outputBucket: process.env.STATEMENT_PDF_BUCKET || '',
    outputPath: 'statements',
    pollingDelay: 3000,
    notificationConfig: {
      type: NotificationType.SQS,
      destination: process.env.STATEMENT_NOTIFICATION_QUEUE_URL || '',
    },
  },
  // Add more queue configurations as needed
];
