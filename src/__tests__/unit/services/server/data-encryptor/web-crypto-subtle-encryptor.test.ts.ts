import { WebCryptoSubtleEncryptor } from '@/services/server/encryptor/web-crypto-subtle-encryptor';

describe('WebCryptoSubtleEncryptor class', () => {
  it('encrypts and decrypts a string when given string and valid key', async () => {
    const dataEncryptor = new WebCryptoSubtleEncryptor();
    const userEmail = 'test123@me.com';
    const newKey = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt'],
    );
    const encryptedEmail = await dataEncryptor.encrypt(userEmail, newKey);
    await expect(encryptedEmail.length).toBeGreaterThan(12);
    await expect(encryptedEmail).not.toBe(userEmail);
    const decryptedData = await dataEncryptor.decrypt(encryptedEmail, newKey);
    await expect(decryptedData).toBe(userEmail);

    const test = await dataEncryptor.encrypt('', newKey);
    await expect(test.length).toBeGreaterThan(12);
    await expect(test).not.toBe('');
  });

  it('throws an error when trying to decrypt an empty string', async () => {
    const dataEncryptor = new WebCryptoSubtleEncryptor();
    const userEmail = '';
    const newKey = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt'],
    );

    await dataEncryptor.encrypt(userEmail, newKey);
    await expect(dataEncryptor.decrypt(userEmail, newKey)).rejects.toThrow(
      'Trying to decrypt an empty string is not allowed.',
    );
  });
});
