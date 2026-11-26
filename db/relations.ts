import { relations } from "drizzle-orm";
import { Comments, Likes, Projects, Users } from "./schema";

// Relations power Drizzle's relational query API (db.query.*).
// They don't affect migrations — drizzle-kit only reads db/schema.ts.

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
