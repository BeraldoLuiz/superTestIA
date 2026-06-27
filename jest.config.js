/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['**/tests/**/*.spec.ts'],
  globalSetup: '<rootDir>/setup/global-setup.ts',
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/api/$1',
    '^@support/(.*)$': '<rootDir>/support/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
  },
  verbose: true,
  testTimeout: 30000, // 30s — external network calls
};
