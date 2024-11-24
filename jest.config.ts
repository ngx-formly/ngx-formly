import { pathsToModuleNameMapper } from 'ts-jest';

export default {
  testEnvironment: '@happy-dom/jest-environment',
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  setupFilesAfterEnv: ['jest-extended/all', '<rootDir>/jestSetup.ts'],
  coverageReporters: ['html'],
  testPathIgnorePatterns: ['/node_modules/', 'schematics/.*/files/(.*)$'],
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@ngx-formly/core': ['src/core/src/public_api'],
      '@ngx-formly/core/testing': ['src/core/testing/src/private_api'],
      '@ngx-formly/core/*': ['src/core/*/src/public_api'],
      '@ngx-formly/*': ['src/ui/*/src/public_api'],
    },
    { prefix: '<rootDir>/' },
  ),
  transformIgnorePatterns: ['node_modules/(?!@ionic/core|@stencil/core|ionicons|.*\\.mjs$)'],
};
