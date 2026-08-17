import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The e2e suite only proves the deck survives production headers if serve.json
// still carries the CloudFront policy verbatim.
const serveConfig = JSON.parse(
  readFileSync(path.resolve(__dirname, "serve.json"), "utf8"),
) as {
  headers: { source: string; headers: { key: string; value: string }[] }[];
};

const terraform = readFileSync(
  path.resolve(__dirname, "../infra/modules/frontend/main.tf"),
  "utf8",
);

const servedPolicy = serveConfig.headers
  .flatMap((rule) => rule.headers)
  .find((header) => header.key === "Content-Security-Policy")?.value;

const deployedPolicy = terraform.match(
  /content_security_policy\s*=\s*"([^"]+)"/,
)?.[1];

describe("content security policy", () => {
  it("serves e2e with the policy CloudFront deploys", () => {
    expect(deployedPolicy).toBeDefined();
    expect(servedPolicy).toBe(deployedPolicy);
  });

  it("allows the inline scripts the static export hydrates from", () => {
    // Without 'unsafe-inline' the RSC payload never executes and the deck
    // renders its placeholder forever.
    expect(deployedPolicy).toContain("script-src 'self' 'unsafe-inline'");
  });
});
