import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against a PRODUCTION build, never the dev server. Dev serves different
 * CSS and different chunking, so a pass there says nothing about what ships.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3272",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npx next start -p 3272",
        url: "http://localhost:3272",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
