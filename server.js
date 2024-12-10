const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

const vapidKeys = webPush.generateVAPIDKeys();

console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);

webPush.setVapidDetails(
  'mailto:example@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
  
    console.log('Received subscription:', subscription);
  
    // Store the subscription (e.g., in a database)
    // For this example, we'll just send a confirmation back
    res.status(201).json({ message: 'Subscription received' });
  
    // Send a push notification (example)
    const payload = JSON.stringify({
      title: 'Push Notification',
      body: 'This is a push notification from the server!',
    });
  
    webPush.sendNotification(subscription, payload)
      .then(response => {
        console.log('Push sent:', response);
      })
      .catch(err => {
        console.error('Error sending push:', err);
      });
  });
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });