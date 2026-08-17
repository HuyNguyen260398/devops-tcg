import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://127.0.0.1:4173", trace: "on-first-retry" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      // hasTouch lets the suite drive genuine touch input, which is routed by
      // hit testing and touch-action the way a phone routes it. Synthesised
      // pointer events skip both, so only real touches can tell whether a
      // gesture ever reaches the deck's handlers.
      use: { viewport: { width: 320, height: 700 }, hasTouch: true },
    },
  ],
  webServer: {
    // serve.json mirrors the CloudFront response headers, so the suite runs
    // against the same CSP as production.
    command:
      "node ./node_modules/serve/build/main.js out --config ../serve.json --listen 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
});
