import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://localhost:8787',
    viewport: { width: 390, height: 844 },
    trace: 'retain-on-failure',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  webServer: {
    command:
      process.env.E2E_NODE_FALLBACK === '1'
        ? 'node scripts/test-server.mjs'
        : 'npm run preview -- --ip 127.0.0.1',
    url: 'http://localhost:8787/api/health',
    reuseExistingServer: false,
    timeout: 60000,
  },
});
