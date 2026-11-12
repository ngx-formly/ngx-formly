import { resolve } from 'node:path';
import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vitest/config';
import { generateMcpContent } from './build/mcp-content.mjs';

export default defineConfig(async () => ({
  resolve: {
    alias: [
      { find: '@ngx-formly/mcp', replacement: resolve('src/mcp/src/index.ts') },
      { find: /^src\/(.*)$/, replacement: resolve('src/$1') },
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
          exclude: ['src/schematics/**', 'src/mcp/**', 'src/validation/**'],
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
      {
        extends: true,
        define: { __FORMLY_MCP_CONTENT__: JSON.stringify(await generateMcpContent()) },
        test: {
          name: 'mcp',
          environment: 'node',
          include: ['src/mcp/**/*.spec.ts', 'src/validation/**/*.spec.ts'],
        },
      },
    ],
    coverage: { reporter: ['html'] },
  },
}));
