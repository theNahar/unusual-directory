import { db } from "@/db/client";
import { bookmarks, categories, userFavorites } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export type Bookmark = typeof bookmarks.$inferSelect;
export type Category = typeof categories.$inferSelect;

export async function getAllBookmarks(): Promise<(Bookmark & { category: Category | null })[]> {
  const results = await db
    .select()
    .from(bookmarks)
    .leftJoin(categories, eq(bookmarks.categoryId, categories.id));
  
  return results.map(row => ({
    ...row.bookmarks,
    category: row.categories,
  }));
}

export async function getAllCategories(): Promise<Category[]> {
  return await db.select().from(categories);
}

export async function getBookmarkById(id: number): Promise<(Bookmark & { category: Category | null }) | null> {
  const results = await db
    .select()
    .from(bookmarks)
    .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
    .where(eq(bookmarks.id, id))
    .limit(1);
  
  if (results.length === 0) {
    return null;
  }

  return {
    ...results[0].bookmarks,
    category: results[0].categories,
  };
}

export async function getBookmarkBySlug(slug: string): Promise<(Bookmark & { category: Category | null }) | null> {
  const results = await db
    .select()
    .from(bookmarks)
    .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
    .where(eq(bookmarks.slug, slug))
    .limit(1);
  
  if (results.length === 0) {
    return null;
  }

  return {
    ...results[0].bookmarks,
    category: results[0].categories,
  };
}

export async function getUserFavorites(userId: string): Promise<(Bookmark & { category: Category | null })[]> {
  const results = await db
    .select()
    .from(userFavorites)
    .innerJoin(bookmarks, eq(userFavorites.bookmarkId, bookmarks.id))
    .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
    .where(eq(userFavorites.userId, userId))
    .orderBy(userFavorites.createdAt);
  
  return results.map(row => ({
    ...row.bookmarks,
    category: row.categories,
  }));
}

export async function isBookmarkFavorited(userId: string, bookmarkId: number): Promise<boolean> {
  const results = await db
    .select()
    .from(userFavorites)
    .where(and(eq(userFavorites.userId, userId), eq(userFavorites.bookmarkId, bookmarkId)))
    .limit(1);
  
  return results.length > 0;
}
