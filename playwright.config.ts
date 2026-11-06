import { defineConfig, devices } from "@playwright/test";

/**
 * Phase 7 smoke tests: nav, one CMS-rendered page, one mocked form submit.
 * Runs against a production build in CI; reuses a running server locally.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm start -- -p 3100",
    url: "http://localhost:3100/en",
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
});
