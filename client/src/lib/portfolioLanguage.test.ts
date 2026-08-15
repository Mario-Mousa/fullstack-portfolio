import { describe, expect, it } from "vitest";
import {
  nextPortfolioLanguage,
  toPortfolioLanguage,
} from "./portfolioLanguage";

describe("portfolio language helpers", () => {
  it("normalizes browser and i18n language codes to the supported portfolio languages", () => {
    expect(toPortfolioLanguage("ar-EG")).toBe("ar");
    expect(toPortfolioLanguage("AR")).toBe("ar");
    expect(toPortfolioLanguage("en-US")).toBe("en");
    expect(toPortfolioLanguage(undefined)).toBe("en");
  });

  it("alternates between the English and Arabic portfolio languages", () => {
    expect(nextPortfolioLanguage("en")).toBe("ar");
    expect(nextPortfolioLanguage("ar")).toBe("en");
  });
});
