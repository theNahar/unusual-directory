import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

// Categories table
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  color: text("color"), // For UI customization
  icon: text("icon"), // For UI customization
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // UUID
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  verificationToken: text("verification_token"),
  verificationExpires: integer("verification_expires", { mode: "timestamp" }),
  passwordHash: text("password_hash"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  lastSignIn: integer("last_sign_in", { mode: "timestamp" }),
});

// User favorites table
export const userFavorites = sqliteTable("user_favorites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookmarkId: integer("bookmark_id").notNull().references(() => bookmarks.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Analytics table
export const analytics = sqliteTable("analytics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), // 'page_view', 'bookmark_click', 'bookmark_favorite', 'bookmark_visit'
  bookmarkId: integer("bookmark_id").references(() => bookmarks.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  sessionId: text("session_id"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  referrer: text("referrer"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Bookmarks table
export const bookmarks = sqliteTable("bookmarks", {
  // Core fields
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull().unique(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),

  // Organization
  categoryId: text("category_id").references(() => categories.id),
  tags: text("tags"), // Comma-separated tags

  // Metadata
  favicon: text("favicon"), // URL to the site's favicon
  ogImage: text("og_image"), // Open Graph image URL
  overview: text("overview"), // Short preview of the content

  // Promotion
  isPromoted: integer("is_promoted", { mode: "boolean" })
    .notNull()
    .default(false),
  promotionExpires: integer("promotion_expires", { mode: "timestamp" }),

  // Analytics
  visitCount: integer("visit_count")
    .notNull()
    .default(0),
  favoriteCount: integer("favorite_count")
    .notNull()
    .default(0),

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),

  // Status
  isArchived: integer("is_archived", { mode: "boolean" })
    .notNull()
    .default(false),
  search_results: text("search_results"),
});

// Relations
export const bookmarksRelations = relations(bookmarks, ({ one, many }) => ({
  category: one(categories, {
    fields: [bookmarks.categoryId],
    references: [categories.id],
  }),
  favorites: many(userFavorites),
  analytics: many(analytics),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  bookmarks: many(bookmarks),
}));

export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(userFavorites),
  analytics: many(analytics),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
  bookmark: one(bookmarks, {
    fields: [userFavorites.bookmarkId],
    references: [bookmarks.id],
  }),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  user: one(users, {
    fields: [analytics.userId],
    references: [users.id],
  }),
  bookmark: one(bookmarks, {
    fields: [analytics.bookmarkId],
    references: [bookmarks.id],
  }),
}));

// Type definitions
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserFavorite = typeof userFavorites.$inferSelect;
export type NewUserFavorite = typeof userFavorites.$inferInsert;

export type Analytics = typeof analytics.$inferSelect;
export type NewAnalytics = typeof analytics.$inferInsert;

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
