class PDFPipeline {
  constructor() {}

  async start() {
    console.log('PDFPipeline started');
  }
}

const service = new PDFPipeline();

service.start().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
