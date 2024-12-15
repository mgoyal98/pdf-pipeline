import dotenv from 'dotenv';

dotenv.config();

export const config = {
  app: {
    name: process.env.APP_NAME || 'pdf-pipeline',
    env: process.env.NODE_ENV || 'development',
  },
  aws: {
    region: process.env.AWS_REGION || 'ap-south-1',
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
};

export default config;
