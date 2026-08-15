export type PortfolioLanguage = "ar" | "en";

export function toPortfolioLanguage(value?: string | null): PortfolioLanguage {
  return value?.toLowerCase().startsWith("ar") ? "ar" : "en";
}

export function nextPortfolioLanguage(
  current: PortfolioLanguage
): PortfolioLanguage {
  return current === "ar" ? "en" : "ar";
}

export function applyPortfolioLanguageToDocument(language: PortfolioLanguage) {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
}
