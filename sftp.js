const Client = require('ssh2-sftp-client');
const fs = require('fs');
require('dotenv').config();
const sftp = new Client();


async function uploadOrderFile() {
  const config = {
    host: process.env.SFTP_HOST,
    port: parseInt(process.env.SFTP_PORT),
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASS,
  };
  console.log("config-", config);

  try {
    await sftp.connect(config);

    const localFilePath = './order.txt'; // Your order text file
    const remoteFilePath = '/www/order.txt';

    await sftp.put(localFilePath, remoteFilePath);
    console.log('File uploaded successfully to SFTP server.');

    await sftp.end();
  } catch (err) {
    console.error('SFTP upload error:', err.message);
  }
}

uploadOrderFile();
