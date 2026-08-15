import { describe, expect, it } from "vitest";
import { validateUploadFile } from "./fileUpload";

describe("upload file validation", () => {
  it("accepts supported files within the configured size limit", () => {
    expect(
      validateUploadFile(
        { type: "image/webp", size: 1024 },
        ["image/jpeg", "image/png", "image/webp"],
        4 * 1024 * 1024
      )
    ).toBe(true);
  });

  it("rejects unsupported file types and oversized files", () => {
    expect(
      validateUploadFile(
        { type: "application/pdf", size: 1024 },
        ["image/jpeg"],
        4 * 1024 * 1024
      )
    ).toBe(false);
    expect(
      validateUploadFile(
        { type: "image/jpeg", size: 9 * 1024 * 1024 },
        ["image/jpeg"],
        4 * 1024 * 1024
      )
    ).toBe(false);
  });
});
