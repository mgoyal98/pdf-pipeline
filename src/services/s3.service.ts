import { S3Client, PutObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import { config } from '../config';
import { logger } from '../utils/logger';
import { IUploadPDFResponse, IUploadPDFOpts } from 'src/interfaces/s3';

export class S3Service {
  private client: S3Client;

  constructor() {
    const s3ClientConfig: S3ClientConfig = {
      region: config.aws.region,
    };

    if (config.aws.credentials.accessKeyId) {
      s3ClientConfig.credentials = config.aws.credentials;
    }

    this.client = new S3Client(s3ClientConfig);
  }

  async uploadPDF(opts: IUploadPDFOpts): Promise<IUploadPDFResponse> {
    try {
      const command = new PutObjectCommand({
        Bucket: opts.bucket,
        Key: opts.key,
        Body: opts.pdf,
        ContentType: 'application/pdf',
      });

      await this.client.send(command);
      return {
        bucket: opts.bucket,
        key: opts.key,
        url: `https://${opts.bucket}.s3.${config.aws.region}.amazonaws.com/${opts.key}`,
      };
    } catch (error) {
      logger.error('[S3Service] Error uploading file:', error);
      throw error;
    }
  }
}
