import React from "react";
import { getAllCategories, getAllBookmarks } from "@/lib/data";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { db } from "@/db/client";
import { users, analytics } from "@/db/schema";
import { sql } from "drizzle-orm";

export default async function AdminPage() {
  const categories = await getAllCategories();
  const bookmarks = await getAllBookmarks();
  
  // Get analytics data
  const [userCount, visitorCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ count: sql<number>`count(*)` }).from(analytics).where(sql`type = 'page_view'`),
  ]);

  return (
    <AdminDashboard 
      categories={categories}
      bookmarks={bookmarks}
      userCount={userCount[0]?.count || 0}
      visitorCount={visitorCount[0]?.count || 0}
    />
  );
}
