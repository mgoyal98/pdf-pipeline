# PDF Pipeline Service

**PDF Pipeline** is a Node.js application designed to automate the process of converting HTML templates into PDF documents using Amazon SQS, Puppeteer, and Mustache. After generating the PDFs, it uploads them to AWS S3 and sends status updates via a flexible notification system (Webhooks and SQS). This app supports multiple queues and configurations, all defined through a single configuration file.

## Features

- 🔄 **Queue-based PDF Generation Pipeline** — Integrates seamlessly with SQS for efficient task management.
- 📄 **HTML to PDF Conversion using Puppeteer** — Leverages Puppeteer for reliable rendering and conversion of dynamic HTML to PDFs.
- ☁️ **AWS S3 Integration for PDF Storage** — Uploads generated PDFs to S3 for easy storage and access.
- 📨 **Flexible Notification System (Webhook & SQS)** — Sends success or error notifications to different destinations.
- 🎨 **Template-based PDF Generation using Mustache** — Customizable PDF generation with Mustache templates.
- 📝 **Comprehensive Logging with Context Tracking** — Keeps track of every action with detailed logs for easier debugging and monitoring.
- ⚙️ **Multi-Queue Support with Individual Configurations** — Supports multiple queues with unique configurations via a single, easy-to-manage config file.
- 🚀 **Microservice-ready architecture**: Easily deploy as an independent service that scales and communicates with other systems via SQS or webhooks.

## 📋 Prerequisites

- Node.js (v18 or higher)
- AWS Account with appropriate permissions
- Docker (optional, for containerized deployment)
- npm or yarn package manager

## 🛠️ Configuration

The app allows you to configure multiple queues, templates, S3 destinations, and notifications within a single configuration file `(queues.config.ts)` for flexibility and ease of management. Each queue in the array supports unique properties such as:

- **name**: A friendly identifier for your queue.
- **queueUrl**: The Amazon SQS URL.
- **templatePath**: The path to your Mustache/HTML template.
- **outputBucket**: The S3 bucket where PDFs will be uploaded.
- **outputPath**: The S3 key or file path format (supports Mustache variables).
- **pollingDelay**: The time interval (in ms) between polls for new messages.
- **notificationConfig**: Defines whether to notify via Webhook or SQS upon success/failure.

Below is an example of how to set up your queues in the configuration file:

```typescript
export const queuesConfig: IQueueConfig[] = [
  {
    name: 'invoice-queue',
    queueUrl: process.env.INVOICE_QUEUE_URL || '',
    templatePath: 'templates/invoice.html',
    outputBucket: process.env.INVOICE_PDF_BUCKET || '',
    outputPath: 'invoices/{{companyId}}/{{invoiceNo}}_{{currentTimestamp}}.pdf',
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
    outputPath: 'statements/{{userId}}/{{endDate}}.pdf',
    pollingDelay: 3000,
    notificationConfig: {
      type: NotificationType.SQS,
      destination: process.env.STATEMENT_NOTIFICATION_QUEUE_URL || '',
    },
  },
  // Add more queue configurations as needed
];
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/mgoyal98/pdf-pipeline.git
   cd pdf-pipeline
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your `.env` file with appropriate keys for SQS, S3, and any other required services.

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm run start
```

### Using Docker

```bash
# Build the container
docker build -t pdf-pipeline .

#Run the container
docker run -p 3000:3000 \
-e AWS_ACCESS_KEY_ID=your_key \
-e AWS_SECRET_ACCESS_KEY=your_secret \
pdf-pipeline
```

Ensure that your AWS credentials and services like SQS and S3 are properly configured.

## 🔄 Process Flow

1. Reads messages from configured SQS queues
2. Renders PDF using Mustache template and Puppeteer
3. Uploads generated PDF to S3
4. Sends status update via webhook or SQS response queue

## 📦 Project Structure

    ```
    .
    ├── src/
    │ ├── config/ # Configuration files
    │ │ ├── index.ts # Main config
    │ │ └── queues.ts # Queue definitions
    │ ├── services/ # Core services
    │ │ └── pdf.service.ts
    │ └── index.ts # Entry point
    ├── Dockerfile
    ├── .dockerignore
    └── package.json
    ```

## Questions or Feedback?

If you have any questions, issues, or suggestions, feel free to open a GitHub [issue]<https://github.com/mgoyal98/pdf-pipeline/issues>. Thank you for using DocWeave!

## License

This project is open-source under the [MIT License](LICENSE). Feel free to fork, modify, and contribute!
