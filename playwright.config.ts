import { defineConfig, devices } from "@playwright/test";
import { readFileSync } from "node:fs";

/**
 * Load .env.local into the test runner so assertions that depend on server
 * configuration (the draft-mode preview secret) run rather than skip.
 * Next loads the file for the app itself; the runner does not.
 */
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  // No .env.local — rely on the ambient environment.
}

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
  // Serial: the CMS tests call POST /api/revalidate, which invalidates the
  // route cache. Run in parallel with the navigation tests, that races them
  // (a page can re-render mid-journey). The suite is small, so determinism
  // is worth more than the wall-clock saving.
  workers: 1,
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
