import { describe, expect, it } from "vitest";
import { isOwnerAccount, normalizeOwnerEmail, resolveOwnerOpenId, resolveRoleWrite } from "./ownerIdentity";

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
    expect(isOwnerAccount({ email: "mariosayers005@gmail.com", loginMethod: "dashboard-password", role: "user" }, "MARIOsayERS005@gmail.com")).toBe(true);
    expect(isOwnerAccount({ email: "mariosayers005@gmail.com", loginMethod: "manus", role: "admin" }, "mariosayers005@gmail.com")).toBe(false);
    expect(isOwnerAccount({ email: "other@example.com", loginMethod: "dashboard-password", role: "admin" }, "mariosayers005@gmail.com")).toBe(false);
  });

  it("preserves a stored administrator role during session-only updates", () => {
    expect(resolveRoleWrite(undefined, "stored-owner-id", "")).toEqual({ role: "user", shouldUpdateExistingRole: false });
    expect(resolveRoleWrite("admin", "stored-owner-id", "")).toEqual({ role: "admin", shouldUpdateExistingRole: true });
  });
});
