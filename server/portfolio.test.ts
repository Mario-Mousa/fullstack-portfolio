import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { projectInput } from "./routers/portfolio";

function createContext(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("portfolio contracts", () => {
  it("rejects incomplete project input before it reaches the database", () => {
    const result = projectInput.safeParse({ titleEn: "A", titleAr: "ب", techStack: [] });
    expect(result.success).toBe(false);
  });

  it("accepts a complete bilingual project input", () => {
    const result = projectInput.safeParse({
      titleEn: "Project", titleAr: "مشروع", descriptionEn: "A valid English project description.",
      descriptionAr: "وصف عربي صالح ومتكامل للمشروع.", techStack: ["React", "ASP.NET Core"],
      imageUrl: null, imageKey: null, githubUrl: "", liveUrl: "", featured: true, sortOrder: 1,
    });
    expect(result.success).toBe(true);
  });

  it("blocks a signed-in non-owner before protected dashboard data is read", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 99, openId: "non-owner-open-id", email: "visitor@example.com", name: "Visitor", loginMethod: "manus", role: "user",
      createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    }));
    await expect(caller.admin.overview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("returns the public profile, projects, and certificates through the public API", async () => {
    const caller = appRouter.createCaller(createContext(null));
    const publicData = await caller.portfolio.publicData();
    expect(publicData).toEqual(expect.objectContaining({ projects: expect.any(Array), certificates: expect.any(Array) }));
    expect(publicData.profile === null || Array.isArray(publicData.profile.skills)).toBe(true);
  });
});
