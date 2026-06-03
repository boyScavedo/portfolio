import { pgTable, serial, text, boolean, timestamp, integer, varchar, index } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverUrl: text("cover_url"),
  tags: text("tags").array().default([]),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("posts_slug_idx").on(t.slug), index("posts_published_idx").on(t.published)]);

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  body: text("body").notNull(),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("comments_post_idx").on(t.postId)]);

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
  ip: varchar("ip", { length: 45 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("likes_post_ip_idx").on(t.postId, t.ip)]);

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  imageUrl: text("image_url"),
  demoUrl: text("demo_url"),
  githubUrl: text("github_url"),
  tags: text("tags").array().default([]),
  featured: boolean("featured").default(false).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 100 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  level: integer("level").default(80),
  order: integer("order").default(0).notNull(),
});

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().default("Jeevan Adhikari"),
  role: varchar("role", { length: 200 }).notNull().default("Full Stack Engineer"),
  tagline: text("tagline").default("Building things for the web & beyond."),
  bio: text("bio"),
  availabilityStatus: varchar("availability_status", { length: 50 }).notNull().default("available"),
  // 'available' | 'employed' | 'freelancing' | 'busy' | 'open_to_offers'
  currentCompany: varchar("current_company", { length: 200 }),
  currentCompanyUrl: text("current_company_url"),
  workType: varchar("work_type", { length: 50 }).notNull().default("fulltime"),
  // 'freelance' | 'fulltime' | 'both' | 'none'
  openToWork: boolean("open_to_work").notNull().default(true),
  location: varchar("location", { length: 100 }).default("Nepal"),
  githubUrl: text("github_url").default("https://github.com/boyScavedo"),
  youtubeUrl: text("youtube_url"),
  twitterUrl: text("twitter_url"),
  linkedinUrl: text("linkedin_url"),
  resumeUrl: text("resume_url"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  body: text("body").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("messages_read_idx").on(t.read)]);
