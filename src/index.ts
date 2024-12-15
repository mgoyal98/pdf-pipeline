import { logger } from './utils/logger';

class PDFPipeline {
  constructor() {}

  async start() {
    logger.info('PDFPipeline started');
  }
}

const service = new PDFPipeline();

service.start().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});
