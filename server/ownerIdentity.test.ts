import { describe, expect, it } from "vitest";
import { isOwnerAccount, normalizeOwnerEmail, resolveOwnerOpenId } from "./ownerIdentity";

describe("owner identity resolution", () => {
  it("normalizes the owner email before comparison", () => {
    expect(normalizeOwnerEmail(" MarioSayers005@Gmail.com ")).toBe("mariosayers005@gmail.com");
  });

  it("uses the persisted owner identity before an unavailable environment fallback", () => {
    expect(resolveOwnerOpenId(" stored-owner-id ", "")).toBe("stored-owner-id");
    expect(resolveOwnerOpenId(undefined, " configured-owner-id ")).toBe("configured-owner-id");
    expect(resolveOwnerOpenId(undefined, undefined)).toBe("");
  });

  it("requires both the administrator role and the configured owner email", () => {
    expect(isOwnerAccount({ email: "mariosayers005@gmail.com", role: "admin" }, "MARIOsayERS005@gmail.com")).toBe(true);
    expect(isOwnerAccount({ email: "mariosayers005@gmail.com", role: "user" }, "mariosayers005@gmail.com")).toBe(false);
    expect(isOwnerAccount({ email: "other@example.com", role: "admin" }, "mariosayers005@gmail.com")).toBe(false);
  });
});
