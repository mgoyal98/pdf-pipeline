const dotenv = require('dotenv');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

dotenv.config();

// Initialize the SQS client
const sqs = new SQSClient({ region: 'ap-south-1' }); // Replace with your region

async function sendMessageToQueue(queueUrl, messageBody) {
  const params = {
    QueueUrl: queueUrl, // Replace with your SQS queue URL
    MessageBody: JSON.stringify(messageBody),
    // Optional parameters
  };

  try {
    const command = new SendMessageCommand(params);
    const response = await sqs.send(command);
    console.log('Message sent successfully:', response.MessageId);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Example usage
const message = {
  id: '123',
  companyId: 'test-company',
  invoiceNo: 'INV-123',
  date: new Date().toISOString(),
  amount: 100,
};

sendMessageToQueue(process.env.INVOICE_QUEUE_URL, message)
  .then((response) => console.log('Message sent:', response))
  .catch((error) => console.error('Failed to send message:', error));

const statementMessage = {
  userId: 'test-user',
  accountHolder: 'Abc Xyz',
  accountNumber: 'ACCT123456789',
  statementDate: new Date().toISOString(),
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  transactions: [
    {
      date: '2024-01-02',
      description: 'Salary Credit',
      reference: 'SAL/JAN/2024',
      debit: '',
      credit: '5000.00',
      balance: '5000.00',
    },
    {
      date: '2024-01-05',
      description: 'ATM Withdrawal',
      reference: 'ATM/123',
      debit: '1000.00',
      credit: '',
      balance: '4000.00',
    },
  ],
  openingBalance: '0.00',
  totalCredits: '5000.00',
  totalDebits: '1000.00',
  closingBalance: '4000.00',
};

sendMessageToQueue(process.env.STATEMENT_QUEUE_URL, statementMessage)
  .then((response) => console.log('Message sent:', response))
  .catch((error) => console.error('Failed to send message:', error));
