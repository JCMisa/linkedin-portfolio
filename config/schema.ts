import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

type SkillsType = {
  id: string;
  title: string;
  description: string;
  items: string[];
  createdAt: Date;
  updatedAt: Date;
};

type TopVoicesType = {
  id: string;
  name: string;
  profileImg: string;
  company: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};

type ExperiencesType = {
  id: string;
  title: string;
  description: string;
  bannerImg: string;
  dateFrom: string;
  dateTo: string;
  createdAt: Date;
  updatedAt: Date;
};

export const Users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar("userId", { length: 255 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    image: text("image"),
    role: varchar("role").default("user").notNull(),
    createdAt: timestamp("createdAt")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp("updatedAt")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("users_userId_idx").on(table.userId)]
);

export const Projects = pgTable("projects", {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  image: text("image"),
  githubLink: text("githubLink"),
  liveLink: text("liveLink"),
  techStacks: text("techStacks")
    .array()
    .default(sql`'{}'::text[]`),
  category: varchar("category"), // tells which category is this project falls under? (tech | va | accounting)
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const Likes = pgTable("likes", {
  id: uuid().defaultRandom().primaryKey(),
  // who created the like
  userId: integer("userId")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),
  // what project did the user liked
  projectId: uuid("projectId")
    .notNull()
    .references(() => Projects.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const Comments = pgTable("comments", {
  id: uuid().defaultRandom().primaryKey(),
  content: text("content").notNull(),
  // who wrote the comment
  userId: integer("userId")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),
  // which project the comment belongs to
  projectId: uuid("projectId")
    .notNull()
    .references(() => Projects.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const Certificates = pgTable("certificates", {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  image: text("image"),
  acquiredDate: timestamp("acquiredDate"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const PersonalInfo = pgTable("personalInfo", {
  id: uuid().defaultRandom().primaryKey(),

  name: varchar("name").default("John Carlo S. Misa").notNull(),
  email: varchar("email").default("johncarlomisa399@gmail.com").notNull(),
  city: varchar("city").default("San Pablo City").notNull(),
  province: varchar("province").default("Laguna").notNull(),
  country: varchar("country").default("Philippines").notNull(),

  contactNumber: varchar("contactNumber").notNull(),
  industryRole: varchar("industryRole").notNull(),

  profileImg: text("profileImg"),
  itResumeLink: text("itResumeLink").notNull(),
  vaResumeLink: text("vaResumeLink").notNull(),
  linkedinLink: text("linkedinLink").notNull(),
  portfolioLink: text("portfolioLink").notNull(),
  githubLink: text("githubLink").notNull(),
  facebookLink: text("facebookLink").notNull(),
  instagramLink: text("instagramLink").notNull(),
  xLink: text("xLink").notNull(),
  about: text("about").notNull(),

  skills: jsonb("skills")
    .$type<SkillsType[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  topVoices: jsonb("topVoices")
    .$type<TopVoicesType[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  experiences: jsonb("experiences")
    .$type<ExperiencesType[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  services: jsonb("services")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
});
export type PersonalInfoType = InferSelectModel<typeof PersonalInfo>;

// ------------------------------------------- SCHEMA RELATIONSHIPS -------------------------------------------

// Relations for the Users table
export const userRelations = relations(Users, ({ many }) => ({
  // A user can have many likes (i.e., like many projects)
  likes: many(Likes),
  // A user can write many comments across projects
  comments: many(Comments),
}));

// Relations for the Projects table
export const projectRelations = relations(Projects, ({ many }) => ({
  // A project can have many likes
  likes: many(Likes),
  // A project can have many comments from many users
  comments: many(Comments),
}));

// Relations for the Likes table
export const likeRelations = relations(Likes, ({ one }) => ({
  // A like belongs to one user
  user: one(Users, {
    fields: [Likes.userId],
    references: [Users.id],
  }),
  // A like belongs to one project
  project: one(Projects, {
    fields: [Likes.projectId],
    references: [Projects.id],
  }),
}));

// Relations for the Comments table
export const commentRelations = relations(Comments, ({ one }) => ({
  // A comment belongs to one user
  user: one(Users, {
    fields: [Comments.userId],
    references: [Users.id],
  }),
  // A comment belongs to one project
  project: one(Projects, {
    fields: [Comments.projectId],
    references: [Projects.id],
  }),
}));
