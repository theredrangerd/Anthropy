import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // Astro 7's `astro preview` auto-detects when it is invoked by an AI
    // agent (isRunByAgent()) and silently daemonizes itself in that case,
    // which makes the parent process exit immediately and Playwright report
    // "Process from config.webServer exited early." Setting this env var
    // (any value) disables that auto-detection so the server stays in the
    // foreground, as Playwright's webServer expects.
    env: { ASTRO_PREVIEW_BACKGROUND: '1' },
  },
});
