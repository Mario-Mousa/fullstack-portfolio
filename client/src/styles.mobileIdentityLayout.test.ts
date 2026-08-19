import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("mobile identity-card layout", () => {
  it("keeps the phone card in the same vertical reading order as desktop", () => {
    const stylesheet = readFileSync(
      resolve(process.cwd(), "client/src/index.css"),
      "utf8",
    );
    const mobileRuleStart = stylesheet.lastIndexOf(
      "/* Keep the desktop reading order on phones",
    );

    expect(mobileRuleStart).toBeGreaterThan(-1);

    const mobileRules = stylesheet.slice(mobileRuleStart);
    expect(mobileRules).toMatch(
      /\.signal-garden \.identity-card\s*\{\s*display: flex;\s*flex-direction: column;/s,
    );
    expect(mobileRules).toMatch(
      /\.signal-garden \.rail-contact\s*\{\s*display: flex;\s*flex-direction: column;/s,
    );
    expect(mobileRules).toMatch(
      /\.signal-garden \.rail-portrait\s*\{[\s\S]*?aspect-ratio: 4 \/ 3;/,
    );
  });
});
