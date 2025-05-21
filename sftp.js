const Client = require('ssh2-sftp-client');
require('dotenv').config();

const sftp = new Client();

exports.upload = async function (localPath, remotePath) {
  console.log("uploading starting-", process.env.SFTP_USER);
  await sftp.connect({
    host: process.env.SFTP_HOST,
    port: parseInt(process.env.SFTP_PORT),
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASS,
  });

  await sftp.put(localPath, remotePath);
  await sftp.end();
};
