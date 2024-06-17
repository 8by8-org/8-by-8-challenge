import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  testEnvironment: './jest-environment.js',
  // Provide an implementation of indexedDB for the IDBUserContextProvider
  // to access.
  setupFiles: ['jest-canvas-mock', 'fake-indexeddb/auto'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverage: true,
  //add directories here to include them in coverage reports and threshold
  collectCoverageFrom: ['./src/**'],
  //directories that should not be counted against the test coverage thresholds
  modulePathIgnorePatterns: [
    '__snapshots__',
    'stories',
    'constants',
    'fonts',
    'model',
  ],
  coveragePathIgnorePatterns: [
    'index.ts',
    'index.tsx',
    'layout.tsx',
    'idb-connection.ts',
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
