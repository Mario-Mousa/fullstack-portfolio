import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { isOwnerAccount, normalizeOwnerEmail, resolveOwnerOpenId } from "./ownerIdentity";
import { adminRouter, portfolioRouter } from "./routers/portfolio";

const dashboardLoginInput = z.object({ email: z.string().trim().email().max(320), password: z.string().min(1).max(256) });
const DASHBOARD_SESSION_MS = 8 * 60 * 60 * 1000;

function passwordsMatch(candidate: string, expected: string) {
  const candidateBytes = Buffer.from(candidate);
  const expectedBytes = Buffer.from(expected);
  return candidateBytes.length === expectedBytes.length && timingSafeEqual(candidateBytes, expectedBytes);
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(async opts => {
      if (!opts.ctx.user) return null;
      const profile = await db.getAdminProfile();
      return { ...opts.ctx.user, isOwner: isOwnerAccount(opts.ctx.user, profile?.email) };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  dashboard: router({
    login: publicProcedure.input(dashboardLoginInput).mutation(async ({ input, ctx }) => {
      const configuredPassword = ENV.dashboardLoginPassword;
      if (!configuredPassword || !passwordsMatch(input.password, configuredPassword)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid dashboard credentials." });
      }
      const profile = await db.getAdminProfile();
      const ownerEmail = normalizeOwnerEmail(profile?.email);
      if (!ownerEmail || normalizeOwnerEmail(input.email) !== ownerEmail) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid dashboard credentials." });
      }
      const existingOwner = await db.getUserByEmail(ownerEmail);
      const ownerOpenId = resolveOwnerOpenId(existingOwner?.openId, ENV.ownerOpenId);
      if (!ownerOpenId) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Owner session identity is not configured." });
      }
      await db.upsertUser({ openId: ownerOpenId, name: profile?.nameEn || "Portfolio Owner", email: ownerEmail, loginMethod: "dashboard-password", role: "admin", lastSignedIn: new Date() });
      const token = await sdk.createSessionToken(ownerOpenId, { expiresInMs: DASHBOARD_SESSION_MS, name: profile?.nameEn || "Portfolio Owner" });
      ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: DASHBOARD_SESSION_MS });
      return { success: true } as const;
    }),
  }),
  portfolio: portfolioRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
