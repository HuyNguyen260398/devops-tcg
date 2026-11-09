import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// An installed app adopts whatever its new worker precaches. If the new sw.js
// is live while CloudFront still serves the old shell and artwork, the worker
// bakes the old deck into its new cache and keeps it until the next content
// change. So the worker is published last: after the rest of the export is
// synced and the invalidation of the edge has finished.
const workflow = readFileSync(
  path.resolve(__dirname, "../.github/workflows/deploy.yml"),
  "utf8",
);

const position = (pattern: RegExp) => {
  const index = workflow.search(pattern);
  expect(index, String(pattern)).toBeGreaterThanOrEqual(0);
  return index;
};

describe("deploy order", () => {
  it("keeps the new worker out of the bulk sync", () => {
    expect(workflow).toMatch(
      // The step is a folded scalar, so the flags may sit on the next line.
      /aws s3 sync frontend\/out [^\n]*\n?[^\n]*--exclude "sw\.js"/,
    );
  });

  it("publishes the worker only after the edge has been invalidated", () => {
    const sync = position(/aws s3 sync frontend\/out/);
    const invalidate = position(/aws cloudfront create-invalidation/);
    const wait = position(/aws cloudfront wait invalidation-completed/);
    const worker = position(/aws s3 cp frontend\/out\/sw\.js/);

    expect(sync).toBeLessThan(invalidate);
    expect(invalidate).toBeLessThan(wait);
    expect(wait).toBeLessThan(worker);
  });
});
