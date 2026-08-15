import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const portfolioProfiles = mysqlTable("portfolio_profiles", {
  id: int("id").primaryKey(),
  nameEn: varchar("nameEn", { length: 120 }).notNull(),
  nameAr: varchar("nameAr", { length: 120 }).notNull(),
  availabilityEn: varchar("availabilityEn", { length: 220 }).notNull().default(""),
  availabilityAr: varchar("availabilityAr", { length: 220 }).notNull().default(""),
  headlineEn: varchar("headlineEn", { length: 220 }).notNull(),
  headlineAr: varchar("headlineAr", { length: 220 }).notNull(),
  bioEn: text("bioEn").notNull(),
  bioAr: text("bioAr").notNull(),
  locationEn: varchar("locationEn", { length: 120 }).notNull(),
  locationAr: varchar("locationAr", { length: 120 }).notNull(),
  educationEn: varchar("educationEn", { length: 320 }).notNull().default(""),
  educationAr: varchar("educationAr", { length: 320 }).notNull().default(""),
  trainingEn: varchar("trainingEn", { length: 320 }).notNull().default(""),
  trainingAr: varchar("trainingAr", { length: 320 }).notNull().default(""),
  avatarUrl: text("avatarUrl"),
  avatarKey: text("avatarKey"),
  skillsJson: text("skillsJson").notNull(),
  githubUrl: varchar("githubUrl", { length: 500 }),
  linkedinUrl: varchar("linkedinUrl", { length: 500 }),
  email: varchar("email", { length: 320 }),
  cvUrl: varchar("cvUrl", { length: 500 }),
  cvKey: text("cvKey"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const portfolioProjects = mysqlTable("portfolio_projects", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("titleEn", { length: 180 }).notNull(),
  titleAr: varchar("titleAr", { length: 180 }).notNull(),
  descriptionEn: text("descriptionEn").notNull(),
  descriptionAr: text("descriptionAr").notNull(),
  techStackJson: text("techStackJson").notNull(),
  imageUrl: text("imageUrl"),
  imageKey: text("imageKey"),
  githubUrl: varchar("githubUrl", { length: 500 }),
  liveUrl: varchar("liveUrl", { length: 500 }),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const portfolioCertificates = mysqlTable("portfolio_certificates", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("titleEn", { length: 180 }).notNull(),
  titleAr: varchar("titleAr", { length: 180 }).notNull(),
  issuer: varchar("issuer", { length: 180 }).notNull(),
  issuedAt: varchar("issuedAt", { length: 80 }).notNull(),
  credentialUrl: varchar("credentialUrl", { length: 500 }),
  imageUrl: text("imageUrl"),
  imageKey: text("imageKey"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  senderName: varchar("senderName", { length: 140 }).notNull(),
  senderEmail: varchar("senderEmail", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 220 }).notNull(),
  body: text("body").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type PortfolioCertificate = typeof portfolioCertificates.$inferSelect;
