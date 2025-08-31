"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CategoryManager } from "@/components/admin/category-manager";
import { BookmarkManager } from "@/components/admin/bookmark-manager";
import { UserManager } from "@/components/admin/user-manager";
import { AdminControls } from "@/components/admin/admin-controls";
import { Section, Container } from "@/components/craft";
import { Bookmark, FolderKanban, Settings2, Eye, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

interface Bookmark {
  id: number;
  title: string;
  slug: string;
  url: string;
  description: string | null;
  overview: string | null;
  search_results: string | null;
  favicon: string | null;
  ogImage: string | null;
  categoryId: string | null;
  tags: string | null;
  isArchived: boolean;
  isPromoted: boolean;
  visitCount: number;
  favoriteCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BookmarkWithCategory extends Bookmark {
  category: Category | null;
}

interface AdminDashboardProps {
  categories: Category[];
  bookmarks: BookmarkWithCategory[];
  userCount: number;
  visitorCount: number;
}

export function AdminDashboard({
  categories,
  bookmarks,
  userCount,
  visitorCount,
}: AdminDashboardProps) {
  const [isAdminControlsOpen, setIsAdminControlsOpen] = useState(false);

  return (
    <Section>
      <Container>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-8">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your bookmarks and categories
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Card className="flex items-center gap-3 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Bookmark className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {bookmarks.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Bookmarks</p>
                </div>
              </Card>
              <Card className="flex items-center gap-3 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FolderKanban className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {categories.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </Card>
              <Card className="flex items-center gap-3 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-500">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {visitorCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Visitors</p>
                </div>
              </Card>
              <Card className="flex items-center gap-3 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500/10 text-green-500">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {userCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Users</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookmarks" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-[600px] grid-cols-3">
                <TabsTrigger value="bookmarks" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  Bookmarks
                </TabsTrigger>
                <TabsTrigger value="categories" className="gap-2">
                  <FolderKanban className="h-4 w-4" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setIsAdminControlsOpen(true)}
                >
                  <Settings2 className="h-4 w-4" />
                  Admin Controls
                </Button>
                <form action="/api/admin/logout">
                  <Button
                    type="submit"
                    variant="outline"
                    className="rounded-xl text-muted-foreground"
                  >
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>

            <TabsContent value="bookmarks" className="space-y-4">
              <div className="rounded-xl border bg-card">
                <div className="border-b bg-muted/50 p-4">
                  <h2 className="text-lg font-semibold">Bookmark Management</h2>
                  <p className="text-sm text-muted-foreground">
                    Add, edit, and manage your bookmarks collection
                  </p>
                </div>
                <div className="p-6">
                  <BookmarkManager
                    bookmarks={bookmarks}
                    categories={categories}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="rounded-xl border bg-card">
                <div className="border-b bg-muted/50 p-4">
                  <h2 className="text-lg font-semibold">Category Management</h2>
                  <p className="text-sm text-muted-foreground">
                    Organize and structure your bookmark categories
                  </p>
                </div>
                <div className="p-6">
                  <CategoryManager categories={categories} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="rounded-xl border bg-card">
                <div className="border-b bg-muted/50 p-4">
                  <h2 className="text-lg font-semibold">User Management</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage registered users and their activity
                  </p>
                </div>
                <div className="p-6">
                  <UserManager />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
      
      {/* Admin Controls Sidebar */}
      <AdminControls 
        isOpen={isAdminControlsOpen} 
        onOpenChange={setIsAdminControlsOpen} 
      />
    </Section>
  );
}
