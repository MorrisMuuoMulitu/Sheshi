import { defineConfig, devices } from "@playwright/test";

/**
 * Phase 7 smoke tests: nav, one CMS-rendered page, one mocked form submit.
 * Runs against a production build in CI; reuses a running server locally.
 *
 * `E2E_PORT` lets a developer (or a CI box with a busy port) move the test
 * server without editing this file.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npm start -- -p ${PORT}`,
    url: `${BASE_URL}/en`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
});
