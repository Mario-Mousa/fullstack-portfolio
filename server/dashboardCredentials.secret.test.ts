import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("dashboard credential secret", () => {
  it("is available to the server without exposing its value in source code", () => {
    expect(process.env.DASHBOARD_LOGIN_PASSWORD).toEqual(expect.any(String));
    expect(process.env.DASHBOARD_LOGIN_PASSWORD?.trim().length).toBeGreaterThan(
      0
    );
  });

  it("accepts the configured secret through the lightweight dashboard login endpoint", async () => {
    const cookies: unknown[] = [];
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {
        cookie: (...args: unknown[]) => cookies.push(args),
      } as TrpcContext["res"],
    };
    const profile = await (await import("./db")).getAdminProfile();
    expect(profile?.email).toBeTruthy();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.dashboard.login({
        email: profile!.email!,
        password: process.env.DASHBOARD_LOGIN_PASSWORD!,
      })
    ).resolves.toEqual({ success: true });
    expect(cookies).toHaveLength(1);
  });

  it("rejects an incorrect password without minting a dashboard session", async () => {
    const cookies: unknown[] = [];
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {
        cookie: (...args: unknown[]) => cookies.push(args),
      } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.dashboard.login({
        email: "owner@example.com",
        password: "incorrect-password",
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(cookies).toHaveLength(0);
  });
});
