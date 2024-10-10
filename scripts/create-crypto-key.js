const crypto = require('crypto');
const copyPaste = require('copy-paste');

(async () => {
  console.log('Generating key...');

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
    copyPaste.copy(keyAsBase64, () => {
      console.log(
        'Generated key and copied it to the clipboard! You can now paste the key into your .env file.',
      );
    });
  } catch (e) {
    console.log(e);
  }
})();
