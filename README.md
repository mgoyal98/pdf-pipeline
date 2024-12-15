# pdf-pipeline
PDF Pipeline is a Node.js app that reads messages from SQS, generates PDFs using Puppeteer and Mustache, uploads them to S3, and updates status via SQS or webhooks. It supports multiple queues and configurations from a single config file.
