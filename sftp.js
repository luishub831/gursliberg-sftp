const Client = require('ssh2-sftp-client');
require('dotenv').config();

const sftp = new Client();

exports.upload = async function (localPath, remotePath) {
  console.log("uploading starting-", process.env.SFTP_USER);
  console.log("localpath-", localPath);
  console.log("remotePath-", remotePath);
  await sftp.connect({
    host: process.env.SFTP_HOST,
    port: parseInt(process.env.SFTP_PORT),
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASS,
    algorithms: {
      kex: [
        'diffie-hellman-group14-sha1',
        'diffie-hellman-group-exchange-sha256',
        'diffie-hellman-group-exchange-sha1',
        'diffie-hellman-group1-sha1'
      ]
    }
  });

  await sftp.put(localPath, remotePath);
  await sftp.end();
};
