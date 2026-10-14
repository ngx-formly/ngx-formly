const { defineConfig } = require('eslint/config');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    ignores: [
      '**/dist/**',
      '**/out-tsc/**',
      'src/schematics/**/*.d.ts',
      'demo/src/assets/stackblitz/**/*.ts',
      'cypress.config.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [tsPlugin.configs['flat/recommended'], angular.configs.tsRecommended],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: ['tsconfig.json', 'tsconfig.spec.json', 'cypress/tsconfig.json'] },
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/no-empty-interface': 0,
      '@typescript-eslint/no-empty-function': 0,
      '@angular-eslint/component-selector': [
        'error',
        {
          prefix: 'formly',
          style: 'kebab-case',
          type: 'element',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          prefix: 'formly',
          style: 'camelCase',
          type: 'attribute',
        },
      ],
      '@angular-eslint/no-conflicting-lifecycle': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/directive-class-suffix': 'off',
      '@angular-eslint/component-class-suffix': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended],
    rules: {
      '@angular-eslint/template/eqeqeq': [
        'warn',
        {
          allowNullOrUndefined: true,
        },
      ],
    },
  },
]);
