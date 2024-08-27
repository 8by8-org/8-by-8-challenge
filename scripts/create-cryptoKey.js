const fs = require('fs-extra');
const path = require('path');

(async () => {

  try {
    const cryptoKey = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt'],
    );

    const rawKey = await crypto.subtle.exportKey('raw', cryptoKey);
    const keyAsBase64 = btoa(String.fromCharCode(...new Uint8Array(rawKey)));
    const envFilePath = path.join(__dirname, '../.env');
    const newEnvVariable = `CRYPTO_KEY=${keyAsBase64}`;

    fs.appendFile(envFilePath, `\n${newEnvVariable}`, err => {
      if (err) {
        console.error('Error writing to .env file:', err);
      } else {
        console.log('.env file updated with Crypto Key successfully!');
      }
    });
  } catch (e) {
    console.log(e);
  }
})();
