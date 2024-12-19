import dotenv from 'dotenv';
import { queuesConfig } from './queues.config';

dotenv.config();

export const config = {
  app: {
    name: process.env.APP_NAME || 'pdf-pipeline',
    env: process.env.NODE_ENV || 'development',
  },
  aws: {
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  },
  puppeteer: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
      '--no-zygote',
      '--no-first-run',
    ],
  },
  queues: queuesConfig,
};

export default config;
