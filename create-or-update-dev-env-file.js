const fs = require('fs');
const crypto = require('crypto');

/**
 * Responsible for creating a .env file for local development if it does not
 * exist already. No variables created by this class point to actual resources.
 */
class DevEnv {
  static #ENV_FILE_NAME = '.env';

  static #TURNSTILE_ENV_VARIABLES = new Map([
    ['NEXT_PUBLIC_TURNSTILE_SITE_KEY', '1x00000000000000000000AA'],
    ['TURNSTILE_SECRET_KEY', '1x0000000000000000000000000000000AA'],
  ]);

  static #FIREBASE_ENV_VARIABLES = new Map([
    ['NEXT_PUBLIC_FIREBASE_API_KEY', 'demo-api-key'],
    ['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'demo-auth-domain'],
    ['NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'demo-project'],
    ['NEXT_PUBLIC_FIREBASE_APP_ID', 'demo-app'],
    ['FIREBASE_CLIENT_EMAIL', 'demo-client-email'],
    ['FIREBASE_PRIVATE_KEY', this.#createFirebasePrivateKey()],
    ['FIREBASE_AUTH_EMULATOR_HOST', '127.0.0.1:9099'],
    ['FIRESTORE_EMULATOR_HOST', '127.0.0.1:8080'],
  ]);

  static createOrUpdateDevEnv() {
    if (!fs.existsSync(this.#ENV_FILE_NAME)) {
      this.#createDevEnv();
    } else {
      this.#updateDevEnv();
    }
  }

  /**
   * Creates a new .env file with all required variables.
   */
  static #createDevEnv() {
    const envContents = this.#getAllEnvVariables()
      .map(([key, value]) => `${key}="${value}"`)
      .join('\n');

    fs.writeFileSync(this.#ENV_FILE_NAME, envContents, 'utf8');
  }

  /**
   * If a .env file already exists, this updates it so that it includes all
   * required variables without modifying existing variables.
   */
  static #updateDevEnv() {
    const envContents = fs.readFileSync(this.#ENV_FILE_NAME, 'utf8');

    const envVariables = this.#getAllEnvVariables();

    envVariables.forEach(([key, value]) => {
      if (!envContents.includes(key)) {
        fs.appendFileSync(this.#ENV_FILE_NAME, `\n${key}="${value}"`, 'utf8');
      }
    });
  }

  /**
   * Creates a dummy RSA key. The actual key does not matter for use with a demo
   * Firebase project, but it must be formatted correctly.
   */
  static #createFirebasePrivateKey() {
    const { privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });

    return privateKey
      .export({
        format: 'pem',
        type: 'pkcs1',
      })
      .toString('base64')
      .replace(/\n/g, '\\n');
  }

  static #getAllEnvVariables() {
    return Array.from(this.#FIREBASE_ENV_VARIABLES.entries()).concat(
      Array.from(this.#TURNSTILE_ENV_VARIABLES.entries()),
    );
  }
}

DevEnv.createOrUpdateDevEnv();
