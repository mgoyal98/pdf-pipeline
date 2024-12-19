import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SQSClientConfig,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
import { config } from '../config';
import { logger } from '../utils/logger';
import { ISQSSendMessage } from '../interfaces/sqs';
import { IQueueConfig } from 'src/interfaces/config';

export class SQSService {
  private sqsClient: SQSClient;

  constructor() {
    const sqsClientConfig: SQSClientConfig = {
      region: config.aws.region,
    };
    if (config.aws.credentials.accessKeyId) {
      sqsClientConfig.credentials = config.aws.credentials;
    }
    this.sqsClient = new SQSClient(sqsClientConfig);
  }

  async receiveMessages(queueConfig: IQueueConfig) {
    try {
      logger.info('[SQSService] Receiving messages');
      const command = new ReceiveMessageCommand({
        QueueUrl: queueConfig.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
      });

      const response = await this.sqsClient.send(command);
      return response.Messages || [];
    } catch (error) {
      logger.error('[SQSService] Error receiving messages:', error);
      throw error;
    }
  }

  async deleteMessage(queueUrl: string, receiptHandle: string) {
    try {
      logger.info('[SQSService] Deleting message');
      const command = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      });
      await this.sqsClient.send(command);
    } catch (error) {
      logger.error('[SQSService] Error deleting message:', error);
      throw error;
    }
  }

  async sendMessage(opts: ISQSSendMessage) {
    try {
      logger.info('[SQSService] Sending message', {
        queueUrl: opts.queueUrl,
      });
      const command = new SendMessageCommand({
        QueueUrl: opts.queueUrl,
        MessageBody: JSON.stringify(opts.body),
      });
      await this.sqsClient.send(command);
    } catch (error) {
      logger.error('[SQSService] Error sending message:', error);
      throw error;
    }
  }
}
