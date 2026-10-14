import { pathsToModuleNameMapper } from 'ts-jest';

export default {
  testEnvironment: '@happy-dom/jest-environment',
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/', '<rootDir>/demo/src/app/'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  setupFilesAfterEnv: ['jest-extended/all', '<rootDir>/jestSetup.ts'],
  coverageReporters: ['html'],
  testPathIgnorePatterns: ['/node_modules/', 'schematics/.*/files/(.*)$'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(
      {
        '@ngx-formly/core': ['src/core/src/public_api'],
        '@ngx-formly/core/testing': ['src/core/testing/src/private_api'],
        '@ngx-formly/core/*': ['src/core/*/src/public_api'],
        '@ngx-formly/*': ['src/ui/*/src/public_api'],
      },
      { prefix: '<rootDir>/' },
    ),
    // Ionicons exposes this component only through the ESM import condition.
    '^ionicons/components/ion-icon\\.js$': '<rootDir>/node_modules/ionicons/components/ion-icon.js',
  },
  transformIgnorePatterns: ['node_modules/(?!@ionic/angular|@ionic/core|@stencil/core|ionicons|.*\\.mjs$)'],
};
