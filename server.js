const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const sftp = require('./sftp');
const formatOrder = require('./formatter');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
console.log("node server started port", process.env.PORT);

app.post('/webhook/order', async (req, res) => {
  try {
    const order = req.body;
    console.log("webhook starting..", order);

    // Format the order to fixed-width string
    const content = formatOrder(order);

    // Save to file
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const filePath = `./N8999869.Gursliberg.${date}.${order.order_number}.txt`;
    fs.writeFileSync(filePath, content);

    // Upload to SFTP
    let remotePath = `/${process.env.REMOTE_FOLDER}/${filePath}`;
    console.log("Uploading to SFTP:", remotePath);
    await sftp.upload(filePath, remotePath);

    res.status(200).send('✅ Order received and processed.');
  } catch (err) {
    console.error('❌ Error handling webhook:', err);
    res.status(500).send('❌ Failed to process order');
  }
});

app.listen(PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});

