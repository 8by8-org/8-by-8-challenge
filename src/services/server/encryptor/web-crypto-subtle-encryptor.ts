import 'server-only';
import { Encryptor } from './encryptor';
import { inject } from 'undecorated-di';

export const WebCryptoSubtleEncryptor = inject(
  /**
   * Encrypts and decrypts a string
   * @example
   * const encryptedData = dataEncryptor.encryptData(userEmail, validKey)
   * const decryptedData = dataEncryptor.decryptData(encryptedData)
   * console.log(decryptedData) - prints out userEmail
   */
  class WebCryptoSubtleEncryptor implements Encryptor {
    /**
     * @encryptData
     * @param data - string to encrypt
     * @param key - a cryptoKey for encryption and decryption
     * @returns A string with the initialization vector concatenated with the encrypted data. The return value will have length of 16 (length of iv) + X (length of plaintext to encrypt) + 16 (authentication tag)
     */
    async encrypt(data: string, key: CryptoKey): Promise<string> {
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(data);
      const ivAsUint8 = crypto.getRandomValues(new Uint8Array(12));

      const encryptedDataAsUint8 = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: ivAsUint8,
        },
        key,
        encodedData,
      );

      const ivAsString = btoa(String.fromCharCode(...ivAsUint8));

      const encryptedDataAsString = btoa(
        String.fromCharCode(...new Uint8Array(encryptedDataAsUint8)),
      );
      return ivAsString + encryptedDataAsString;
    }
    /**
     * @decryptData
     * @param data - string with the initialization vector concatenated with encrypted data
     * @remarks can throw error if the input string is not valid
     * @example if "testemail@123.com" was passed in with no IV vector, this method will throw an error of "The provided data is too small."
     * @returns unencrypted user data
     */
    async decrypt(dataToDecrypt: string, key: CryptoKey): Promise<string> {
      if (dataToDecrypt.length < 16) {
        throw new Error('Trying to decrypt an empty string is not allowed.');
      }

      const ivAsString = dataToDecrypt.slice(0, 16);
      const encryptedDataAsString = dataToDecrypt.slice(16);

      const ivAsUint8 = new Uint8Array(
        atob(ivAsString)
          .split('')
          .map(char => char.charCodeAt(0)),
      );

      const encryptedDataAsUint8 = new Uint8Array(
        atob(encryptedDataAsString)
          .split('')
          .map(char => char.charCodeAt(0)),
      );

      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivAsUint8,
        },
        key,
        encryptedDataAsUint8,
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
    }
  },
  [],
);
