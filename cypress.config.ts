import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/ssr',
    supportFile: false,
  },
});
