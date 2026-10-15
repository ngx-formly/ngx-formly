import { resolve } from 'node:path';
import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@ngx-formly/core/testing', replacement: resolve('src/core/testing/src/private_api.ts') },
      { find: /^@ngx-formly\/core$/, replacement: resolve('src/core/src/public_api.ts') },
      { find: /^@ngx-formly\/core\/(.*)$/, replacement: resolve('src/core/$1/src/public_api.ts') },
      { find: /^@ngx-formly\/(.*)$/, replacement: resolve('src/ui/$1/src/public_api.ts') },
    ],
  },
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        plugins: [angular({ tsconfig: 'tsconfig.spec.json', jit: true })],
        test: {
          name: 'angular',
          environment: 'happy-dom',
          setupFiles: ['./vitestSetup.ts'],
          include: ['src/**/*.{spec,test}.ts', 'demo/src/app/**/*.{spec,test}.ts'],
          exclude: ['src/schematics/**'],
        },
      },
      {
        extends: true,
        test: {
          name: 'schematics',
          pool: 'forks',
          environment: 'node',
          setupFiles: ['./src/schematics/test-setup.ts'],
          include: ['src/schematics/**/*.{spec,test}.ts'],
          exclude: ['src/schematics/**/files/**'],
        },
      },
    ],
    coverage: { reporter: ['html'] },
  },
});
