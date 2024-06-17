const JestEnvironmentJSDOM = require('jest-environment-jsdom').default;

/**
 * Creates a custom Jest environment so that the `@paralleldrive/cuid2` package
 * can access `TextEncoder` as a global variable.
 */
module.exports = class CustomJestEnvironment extends JestEnvironmentJSDOM {
  constructor(...args) {
    const { global } = super(...args);
    global.TextEncoder = TextEncoder;
    global.fetch = fetch;
    global.Request = Request;
    global.Response = Response;
  }
};
