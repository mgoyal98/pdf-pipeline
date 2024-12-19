const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

// Initialize the SQS client
const sqs = new SQSClient({ region: 'ap-south-1' }); // Replace with your region

async function sendMessageToQueue(messageBody) {
  const params = {
    QueueUrl: 'https://sqs.ap-south-1.amazonaws.com/275278671230/invoice-pdf', // Replace with your SQS queue URL
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
  date: new Date().toISOString(),
  amount: 100,
};

sendMessageToQueue(message)
  .then((response) => console.log('Message sent:', response))
  .catch((error) => console.error('Failed to send message:', error));
