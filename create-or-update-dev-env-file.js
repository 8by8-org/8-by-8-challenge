const fs = require('fs');

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

  static #getAllEnvVariables() {
    return Array.from(this.#TURNSTILE_ENV_VARIABLES.entries());
  }
}

DevEnv.createOrUpdateDevEnv();
