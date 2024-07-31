export interface Encryptor {
  encrypt(data: string, key: CryptoKey): Promise<string>;
  decrypt(dataToDecrypt: string, key: CryptoKey): Promise<string>;
}
