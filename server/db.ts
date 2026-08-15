import { asc, count, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  contactMessages,
  type InsertUser,
  portfolioCertificates,
  portfolioProfiles,
  portfolioProjects,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

const defaultProfile = {
  id: 1,
  nameEn: "Your Name",
  nameAr: "اسمك هنا",
  availabilityEn: "",
  availabilityAr: "",
  headlineEn: "Full-Stack .NET & React Developer",
  headlineAr: "مطور Full-Stack باستخدام .NET وReact",
  bioEn: "I build practical, reliable software with thoughtful user experiences.",
  bioAr: "أبني برمجيات عملية وموثوقة بتجارب استخدام مدروسة.",
  locationEn: "Egypt",
  locationAr: "مصر",
  educationEn: "",
  educationAr: "",
  trainingEn: "",
  trainingAr: "",
  skillsJson: "[]",
  githubUrl: null,
  linkedinUrl: null,
  email: null,
  cvUrl: null,
  cvKey: null,
  avatarUrl: null,
  avatarKey: null,
};

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    _db = drizzle(process.env.DATABASE_URL);
  }
  return _db;
}

function safeJsonList(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every(item => typeof item === "string") ? parsed : [];
  } catch {
    return [];
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };
  (["name", "email", "loginMethod"] as const).forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field];
      updateSet[field] = user[field] ?? null;
    }
  });
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getPublicPortfolio() {
  const db = await getDb();
  if (!db) return { profile: null, projects: [], certificates: [] };
  const [profile] = await db.select().from(portfolioProfiles).where(eq(portfolioProfiles.id, 1)).limit(1);
  const [projects, certificates] = await Promise.all([
    db.select().from(portfolioProjects).orderBy(desc(portfolioProjects.featured), asc(portfolioProjects.sortOrder), desc(portfolioProjects.createdAt)),
    db.select().from(portfolioCertificates).orderBy(asc(portfolioCertificates.sortOrder), desc(portfolioCertificates.createdAt)),
  ]);
  return {
    profile: profile ? { ...profile, skills: safeJsonList(profile.skillsJson) } : null,
    projects: projects.map(project => ({ ...project, techStack: safeJsonList(project.techStackJson) })),
    certificates,
  };
}

export async function getAdminProfile() {
  const db = await getDb();
  if (!db) return { ...defaultProfile, skills: [] };
  const [profile] = await db.select().from(portfolioProfiles).where(eq(portfolioProfiles.id, 1)).limit(1);
  const selectedProfile = profile ?? defaultProfile;
  return { ...selectedProfile, skills: safeJsonList(selectedProfile.skillsJson) };
}

type ProfileSaveInput = {
  nameEn: string; nameAr: string; headlineEn: string; headlineAr: string;
  availabilityEn: string; availabilityAr: string; bioEn: string; bioAr: string; locationEn: string; locationAr: string;
  educationEn: string; educationAr: string; trainingEn: string; trainingAr: string; skills: string[];
  avatarUrl?: string | null; avatarKey?: string | null; githubUrl?: string | null;
  linkedinUrl?: string | null; email?: string | null; cvUrl?: string | null; cvKey?: string | null;
};

export async function saveProfile(values: ProfileSaveInput) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const payload = {
    id: 1,
    ...values,
    avatarUrl: values.avatarUrl ?? null,
    avatarKey: values.avatarKey ?? null,
    githubUrl: values.githubUrl ?? null,
    linkedinUrl: values.linkedinUrl ?? null,
    email: values.email ?? null,
    cvUrl: values.cvUrl ?? null,
    cvKey: values.cvKey ?? null,
    skillsJson: JSON.stringify(values.skills),
  };
  await db.insert(portfolioProfiles).values(payload).onDuplicateKeyUpdate({ set: payload });
}

export async function listProjects() {
  const db = await getDb();
  if (!db) return [];
  const projects = await db.select().from(portfolioProjects).orderBy(asc(portfolioProjects.sortOrder), desc(portfolioProjects.createdAt));
  return projects.map(project => ({ ...project, techStack: safeJsonList(project.techStackJson) }));
}

export async function createProject(values: Omit<typeof portfolioProjects.$inferInsert, "id" | "createdAt" | "updatedAt" | "techStackJson"> & { techStack: string[] }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(portfolioProjects).values({ ...values, techStackJson: JSON.stringify(values.techStack) });
}

export async function updateProject(id: number, values: Omit<typeof portfolioProjects.$inferInsert, "id" | "createdAt" | "updatedAt" | "techStackJson"> & { techStack: string[] }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(portfolioProjects).set({ ...values, techStackJson: JSON.stringify(values.techStack) }).where(eq(portfolioProjects.id, id));
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
}

export async function listCertificates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioCertificates).orderBy(asc(portfolioCertificates.sortOrder), desc(portfolioCertificates.createdAt));
}

export async function createCertificate(values: Omit<typeof portfolioCertificates.$inferInsert, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(portfolioCertificates).values(values);
}

export async function updateCertificate(id: number, values: Omit<typeof portfolioCertificates.$inferInsert, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(portfolioCertificates).set(values).where(eq(portfolioCertificates.id, id));
}

export async function deleteCertificate(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(portfolioCertificates).where(eq(portfolioCertificates.id, id));
}

export async function createMessage(values: typeof contactMessages.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(contactMessages).values(values);
}

export async function listMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function markMessageRead(id: number, isRead: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(contactMessages).set({ isRead }).where(eq(contactMessages.id, id));
}

export async function getOverviewStats() {
  const db = await getDb();
  if (!db) return { projectCount: 0, certificateCount: 0, messageCount: 0, unreadCount: 0 };
  const [[projectCount], [certificateCount], [messageCount], messages] = await Promise.all([
    db.select({ value: count() }).from(portfolioProjects),
    db.select({ value: count() }).from(portfolioCertificates),
    db.select({ value: count() }).from(contactMessages),
    db.select({ isRead: contactMessages.isRead }).from(contactMessages),
  ]);
  return {
    projectCount: projectCount?.value ?? 0,
    certificateCount: certificateCount?.value ?? 0,
    messageCount: messageCount?.value ?? 0,
    unreadCount: messages.filter(message => !message.isRead).length,
  };
}
