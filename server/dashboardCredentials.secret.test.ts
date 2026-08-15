import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("dashboard credential secret", () => {
  it("is available to the server with the supplied password value", () => {
    expect(process.env.DASHBOARD_LOGIN_PASSWORD).toBe("[REDACTED]");
  });

  it("accepts the configured secret through the lightweight dashboard login endpoint", async () => {
    const cookies: unknown[] = [];
    const ctx: TrpcContext = { user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: { cookie: (...args: unknown[]) => cookies.push(args) } as TrpcContext["res"] };
    const profile = await (await import("./db")).getAdminProfile();
    expect(profile?.email).toBeTruthy();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.dashboard.login({ email: profile!.email!, password: process.env.DASHBOARD_LOGIN_PASSWORD! })).resolves.toEqual({ success: true });
    expect(cookies).toHaveLength(1);
  });
});
