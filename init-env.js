const fs = require('fs');

initEnv();

/**
 * Copies .env.example into .env so that tests successfully run in CI workflows.
 */
function initEnv() {
  fs.copyFileSync('./.env.example', './.env');
}
