const fs = require('fs');
const crypto = require('crypto');

/**
 * Responsible for creating a .env file for local development if it does not
 * exist already. No variables created by this class point to actual resources.
 */
class DevEnv {
  static #ENV_FILE_NAME = '.env';
  static #TURNSTILE_PUBLIC_ENV_VARIABLE_NAME = 'NEXT_PUBLIC_TURNSTILE_SITE_KEY';
  static #TURNSTILE_PRIVATE_ENV_VARIABLE_NAME =
    'NEXT_PRIVATE_TURNSTILE_SECRET_KEY';
  static #FIREBASE_PROJECT_ID_VARIABLE_NAME = 'NEXT_PUBLIC_FIREBASE_PROJECT_ID';
  static #FIREBASE_CLIENT_EMAIL_VARIABLE_NAME = 'FIREBASE_CLIENT_EMAIL';
  static #FIREBASE_PRIVATE_KEY_VARIABLE_NAME = 'FIREBASE_PRIVATE_KEY';
  static #FIREBASE_AUTH_EMULATOR_HOST_VARIABLE_NAME =
    'FIREBASE_AUTH_EMULATOR_HOST';
  static #FIRESTORE_EMULATOR_HOST_VARIABLE_NAME = 'FIRESTORE_EMULATOR_HOST';

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
    const envFileContents = [
      this.#createTurnstileSiteKey(),
      this.#createTurnstileSecretKey(),
      this.#createFirebaseProjectId(),
      this.#createFirebaseClientEmail(),
      this.#createFirebasePrivateKey(),
      this.#createFirebaseAuthEmulatorHost(),
      this.#createFirestoreEmulatorHost(),
    ];

    fs.writeFileSync(this.#ENV_FILE_NAME, envFileContents.join('\n'), 'utf8');
  }

  /**
   * If a .env file already exists, this updates it so that it includes all
   * required variables without modifying existing variables.
   */
  static #updateDevEnv() {
    const envContents = fs.readFileSync(this.#ENV_FILE_NAME, 'utf8');

    if (!envContents.includes(this.#TURNSTILE_PUBLIC_ENV_VARIABLE_NAME)) {
      fs.appendFileSync(
        this.#ENV_FILE_NAME,
        '\n' + this.#createTurnstileSiteKey(),
      );
    }

    if (!envContents.includes(this.#TURNSTILE_PRIVATE_ENV_VARIABLE_NAME)) {
      fs.appendFileSync(
        this.#ENV_FILE_NAME,
        '\n' + this.#createTurnstileSecretKey(),
      );
    }

    if (!envContents.includes(this.#FIREBASE_PROJECT_ID_VARIABLE_NAME)) {
      fs.appendFileSync(
        this.#ENV_FILE_NAME,
        '\n' + this.#createFirebaseProjectId(),
      );
    }

    if (!envContents.includes(this.#FIREBASE_CLIENT_EMAIL_VARIABLE_NAME)) {
      fs.appendFileSync(
        this.#ENV_FILE_NAME,
        '\n' + this.#createFirebaseClientEmail(),
      );
    }

    if (!envContents.includes(this.#FIREBASE_PRIVATE_KEY_VARIABLE_NAME)) {
      fs.appendFileSync(
        this.#ENV_FILE_NAME,
        '\n' + this.#createFirebasePrivateKey(),
      );
    }

    if (
      !envContents.includes(this.#FIREBASE_AUTH_EMULATOR_HOST_VARIABLE_NAME)
    ) {
      fs.appendFileSync(
        this.#ENV_FILE_NAME,
        '\n' + this.#createFirebaseAuthEmulatorHost(),
      );
    }

    if (!envContents.includes(this.#FIRESTORE_EMULATOR_HOST_VARIABLE_NAME)) {
      fs.appendFileSync(
        this.#ENV_FILE_NAME,
        '\n' + this.#createFirestoreEmulatorHost(),
      );
    }
  }

  /**
   * Creates a dummy Cloudflare Turnstile site key.
   */
  static #createTurnstileSiteKey() {
    return `${this.#TURNSTILE_PUBLIC_ENV_VARIABLE_NAME}="1x00000000000000000000AA"`;
  }

  /**
   * Creates a dummy Cloudflare Turnstile secret key.
   */
  static #createTurnstileSecretKey() {
    return `${this.#TURNSTILE_PRIVATE_ENV_VARIABLE_NAME}="1x0000000000000000000000000000000AA"`;
  }

  /**
   * Creates a project id for a Firebase demo app. A demo app is not associated
   * with any actual resources, but can be used to start Firebase emulators for
   * local development. The id must start with "demo-", but apart from that, it
   * has been chosen arbitrarily.
   */
  static #createFirebaseProjectId() {
    return `${this.#FIREBASE_PROJECT_ID_VARIABLE_NAME}="demo-app"`;
  }

  /**
   * Creates a dummy Firebase client email. The value is arbitrary.
   */
  static #createFirebaseClientEmail() {
    return `${this.#FIREBASE_CLIENT_EMAIL_VARIABLE_NAME}="demo-client-email"`;
  }

  /**
   * Creates a dummy RSA key. The actual key does not matter for use with a demo
   * Firebase project, but it must be formatted correctly.
   */
  static #createFirebasePrivateKey() {
    const { privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });

    return `${this.#FIREBASE_PRIVATE_KEY_VARIABLE_NAME}="${privateKey
      .export({
        format: 'pem',
        type: 'pkcs1',
      })
      .toString('base64')
      .replace(/\n/g, '\\n')}"`;
  }

  static #createFirebaseAuthEmulatorHost() {
    return `${this.#FIREBASE_AUTH_EMULATOR_HOST_VARIABLE_NAME}="127.0.0.1:9099"`;
  }

  static #createFirestoreEmulatorHost() {
    return `${this.#FIRESTORE_EMULATOR_HOST_VARIABLE_NAME}="127.0.0.1:8080"`;
  }
}

DevEnv.createOrUpdateDevEnv();
