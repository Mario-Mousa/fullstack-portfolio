import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import * as db from "../db";
import { ENV } from "../_core/env";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";

const nullableUrl = z.union([z.string().url(), z.literal("")]).transform(value => value || null).optional();
const nullableText = z.string().trim().max(600).nullable().optional();
export const publicFileUrl = z.union([
  z.string().url(),
  z.string().regex(/^\/manus-storage\/[a-zA-Z0-9_./-]+$/),
  z.literal(""),
]).transform(value => value || null).optional();
export const projectInput = z.object({
  titleEn: z.string().trim().min(2).max(180), titleAr: z.string().trim().min(2).max(180),
  descriptionEn: z.string().trim().min(10).max(4000), descriptionAr: z.string().trim().min(10).max(4000),
  techStack: z.array(z.string().trim().min(1).max(50)).max(20), imageUrl: nullableText,
  imageKey: nullableText, githubUrl: nullableUrl, liveUrl: nullableUrl,
  featured: z.boolean().default(false), sortOrder: z.number().int().min(0).max(999).default(0),
});
export const certificateInput = z.object({
  titleEn: z.string().trim().min(2).max(180), titleAr: z.string().trim().min(2).max(180),
  issuer: z.string().trim().min(2).max(180), issuedAt: z.string().trim().min(2).max(80),
  credentialUrl: nullableUrl, imageUrl: nullableText, imageKey: nullableText,
  sortOrder: z.number().int().min(0).max(999).default(0),
});
export const profileInput = z.object({
  nameEn: z.string().trim().min(2).max(120), nameAr: z.string().trim().min(2).max(120),
  availabilityEn: z.string().trim().min(2).max(220), availabilityAr: z.string().trim().min(2).max(220),
  headlineEn: z.string().trim().min(2).max(220), headlineAr: z.string().trim().min(2).max(220),
  bioEn: z.string().trim().min(10).max(4000), bioAr: z.string().trim().min(10).max(4000),
  locationEn: z.string().trim().min(2).max(120), locationAr: z.string().trim().min(2).max(120),
  educationEn: z.string().trim().min(2).max(320), educationAr: z.string().trim().min(2).max(320),
  trainingEn: z.string().trim().min(2).max(320), trainingAr: z.string().trim().min(2).max(320),
  avatarUrl: nullableText, avatarKey: nullableText, skills: z.array(z.string().trim().min(1).max(50)).max(30),
  githubUrl: nullableUrl, linkedinUrl: nullableUrl, email: z.union([z.string().email(), z.literal("")]).transform(value => value || null),
  cvUrl: publicFileUrl, cvKey: nullableText,
});

export const cvUploadInput = z.object({
  base64: z.string().min(20).max(11_200_000),
  fileName: z.string().min(1).max(180),
  contentType: z.literal("application/pdf"),
});

const ownerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" || ctx.user.openId !== ENV.ownerOpenId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Owner access is required." });
  }
  return next();
});

export const portfolioRouter = router({
  publicData: publicProcedure.query(() => db.getPublicPortfolio()),
  sendMessage: publicProcedure.input(z.object({
    senderName: z.string().trim().min(2).max(140), senderEmail: z.string().email().max(320),
    subject: z.string().trim().min(3).max(220), body: z.string().trim().min(10).max(4000),
  })).mutation(({ input }) => db.createMessage(input)),
});

export const adminRouter = router({
  overview: ownerProcedure.query(() => db.getOverviewStats()),
  profile: router({
    get: ownerProcedure.query(() => db.getAdminProfile()),
    update: ownerProcedure.input(profileInput).mutation(({ input }) => db.saveProfile(input)),
  }),
  projects: router({
    list: ownerProcedure.query(() => db.listProjects()),
    create: ownerProcedure.input(projectInput).mutation(({ input }) => db.createProject(input)),
    update: ownerProcedure.input(z.object({ id: z.number().int().positive(), values: projectInput })).mutation(({ input }) => db.updateProject(input.id, input.values)),
    delete: ownerProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => db.deleteProject(input.id)),
  }),
  certificates: router({
    list: ownerProcedure.query(() => db.listCertificates()),
    create: ownerProcedure.input(certificateInput).mutation(({ input }) => db.createCertificate(input)),
    update: ownerProcedure.input(z.object({ id: z.number().int().positive(), values: certificateInput })).mutation(({ input }) => db.updateCertificate(input.id, input.values)),
    delete: ownerProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => db.deleteCertificate(input.id)),
  }),
  messages: router({
    list: ownerProcedure.query(() => db.listMessages()),
    markRead: ownerProcedure.input(z.object({ id: z.number().int().positive(), isRead: z.boolean() })).mutation(({ input }) => db.markMessageRead(input.id, input.isRead)),
  }),
  media: router({
    uploadImage: ownerProcedure.input(z.object({
      base64: z.string().min(20).max(5_600_000), fileName: z.string().min(1).max(180),
      contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
    })).mutation(async ({ ctx, input }) => {
      const fileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      const key = `portfolio/${ctx.user.id}/${Date.now()}-${nanoid(8)}-${fileName}`;
      const buffer = Buffer.from(input.base64, "base64");
      const uploaded = await storagePut(key, buffer, input.contentType);
      return uploaded;
    }),
    uploadCv: ownerProcedure.input(cvUploadInput).mutation(async ({ ctx, input }) => {
      const fileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/(?:\.pdf)?$/i, ".pdf");
      const key = `portfolio/${ctx.user.id}/cv/${Date.now()}-${nanoid(8)}-${fileName}`;
      const uploaded = await storagePut(key, Buffer.from(input.base64, "base64"), "application/pdf");
      return uploaded;
    }),
  }),
});
