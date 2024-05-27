import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  setupFiles: ['jest-canvas-mock'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  //add directories here to include them in coverage reports and threshold
  collectCoverageFrom: ['./src/**'],
  //directories that should not be counted against the test coverage thresholds
  modulePathIgnorePatterns: [
    '__snapshots__',
    './src/model/enums',
    './src/stories',
    'fonts',
  ],
  /*
    TODO : remove 'local-user-service.ts' once it is implemented. Then, tests
    can be added for 'user-context.tsx' and it can be removed from this array
    as well.
  */
  coveragePathIgnorePatterns: [
    'index.ts',
    'index.tsx',
    'layout.tsx',
    'local-user-service.ts',
    'user-context.tsx',
  ],
  //require 100% code coverage for the tests to pass
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
