const { TelegramClient } = require('gramjs');
const { StringSession } = require('gramjs/sessions');
const { Api } = require('gramjs');
const readline = require('readline');

// Replace with your actual API credentials
const apiId = 1234567; 
const apiHash = 'your_api_hash'; 
const stringSession = new StringSession('');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptForInput(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function main() {
  // Get dynamic inputs for URL and recipient
  const link = await promptForInput("Please enter the URL to send: ");
  const recipient = await promptForInput("Please enter the recipient username or chat_id: ");

  // Initialize Telegram client
  const client = new TelegramClient(stringSession, apiId, apiHash);
  
  // Start client with necessary authentication steps
  await client.start({
    phoneNumber: async () => {
      return new Promise(resolve => {
        rl.question('Please enter your phone number: ', resolve);
      });
    },
    password: async () => {
      return new Promise(resolve => {
        rl.question('Please enter your 2FA password (if you have one): ', resolve);
      });
    },
    phoneCode: async () => {
      return new Promise(resolve => {
        rl.question('Please enter the code you received: ', resolve);
      });
    },
    onError: (err) => console.log(err),
  });

  console.log("Successfully connected to Telegram");

  // Send a message with the provided URL to the specified recipient
  try {
    const result = await client.sendMessage(recipient, { message: `Here is your link: ${link}` });
    console.log('Message sent:', result);
  } catch (err) {
    console.error('Error sending message:', err);
  }

  // Save session string for future use
  console.log("Your session string is:", client.session.save());
}

main().catch(console.error);
