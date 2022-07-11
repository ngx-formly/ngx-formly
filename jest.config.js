const { pathsToModuleNameMapper } = require('ts-jest');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  setupFilesAfterEnv: ['jest-extended/all', '<rootDir>/jestSetup.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  coverageReporters: ['html'],
  testPathIgnorePatterns: [
    '/node_modules/',
    'schematics/.*/files/(.*)$'
  ],
  moduleNameMapper: pathsToModuleNameMapper(
    {
      "@ngx-formly/core": ["src/core/src/public_api"],
      "@ngx-formly/core/testing": ["src/core/testing/src/private_api"],
      "@ngx-formly/core/*": ["src/core/*/src/public_api"],
      "@ngx-formly/*": ["src/ui/*/src/public_api"],
    },
    { prefix: '<rootDir>/' },
  ),
};
