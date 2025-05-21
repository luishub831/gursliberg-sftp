const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const sftp = require('./sftp');
const formatOrder = require('./formatter');

const app = express();
app.use(bodyParser.json());
console.log("node server started", process.env.SFTP_USER);

app.post('/webhook/order', async (req, res) => {
  try {
    const order = req.body;
    console.log("webhook starting..");

    // Format the order to fixed-width string
    const content = formatOrder(order);

    // Save to file
    const filePath = `./order-${order.id}.txt`;
    fs.writeFileSync(filePath, content);

    // Upload to SFTP
    await sftp.upload(filePath, `/www/order-${order.id}.txt`);

    res.status(200).send('✅ Order received and processed.');
  } catch (err) {
    console.error('❌ Error handling webhook:', err);
    res.status(500).send('❌ Failed to process order');
  }
});

app.listen(3000, () => console.log('🚀 Server running on port 3000'));
