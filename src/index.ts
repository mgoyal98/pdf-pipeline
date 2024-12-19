import config from './config';
import { IQueueConfig } from './interfaces/config';
import { NotificationService } from './services/notification.service';
import { PDFService } from './services/pdf.service';
import { S3Service } from './services/s3.service';
import { SQSService } from './services/sqs.service';
import { logger } from './utils/logger';

class PDFPipeline {
  private sqsService: SQSService;
  private pdfService: PDFService;
  private s3Service: S3Service;
  private notificationService: NotificationService;

  constructor() {
    this.sqsService = new SQSService();
    this.pdfService = new PDFService();
    this.s3Service = new S3Service();
    this.notificationService = new NotificationService();
  }

  async start() {
    logger.info('PDFPipeline started');
    for (const queueConfig of config.queues) {
      this.processQueue(queueConfig);
    }
  }

  private async processQueue(queueConfig: IQueueConfig) {
    logger.info(`[${queueConfig.name}] Processing queue`, {
      queueUrl: queueConfig.queueUrl,
    });
    while (true) {
      try {
        const messages = await this.sqsService.receiveMessages(queueConfig);

        logger.info(`[${queueConfig.name}] Received messages`, {
          messages: messages.length,
        });

        for (const message of messages) {
          await this.processQueueMessage(queueConfig, message);
        }
      } catch (error) {
        logger.error(
          `[${queueConfig.name}] Error in queue processing loop:`,
          error
        );
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait before retrying
      }
    }
  }

  private async processQueueMessage(queueConfig: IQueueConfig, message: any) {
    try {
      logger.info(`[${queueConfig.name}] Processing message`);
      const data = JSON.parse(message.Body!);

      // Generate PDF
      const pdf = await this.pdfService.generatePDF(
        queueConfig.name,
        queueConfig.templatePath,
        data
      );

      // Upload to S3
      const fileName = `${queueConfig.outputPath}/${
        queueConfig.name
      }-${Date.now()}.pdf`;
      const uploadPdfResponse = await this.s3Service.uploadPDF({
        bucket: queueConfig.outputBucket,
        key: fileName,
        pdf: pdf,
      });

      // Send notification
      await this.notificationService.notify({
        type: queueConfig.notificationConfig.type,
        destination: queueConfig.notificationConfig.destination,
        message: {
          status: 'success',
          pdf: uploadPdfResponse,
          originalMessage: data,
        },
      });

      // Delete message from queue
      await this.sqsService.deleteMessage(
        queueConfig.queueUrl,
        message.ReceiptHandle!
      );
    } catch (error) {
      logger.error(`[${queueConfig.name}] Error processing message:`, error);

      // Send error notification
      await this.notificationService.notify({
        type: queueConfig.notificationConfig.type,
        destination: queueConfig.notificationConfig.destination,
        message: {
          status: 'error',
          error: (error as Error).message,
          originalMessage: message.Body,
        },
      });
    } finally {
      if (queueConfig.pollingDelay) {
        await new Promise((resolve) =>
          setTimeout(resolve, queueConfig.pollingDelay)
        );
      }
    }
  }
}

const service = new PDFPipeline();

service.start().catch((error) => {
  logger.error(`[PDFPipeline] Fatal error:`, error);
  process.exit(1);
});
