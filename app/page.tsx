// React + Next Imports
import React from "react";
import { Suspense } from "react";

// Database Imports
import { getAllBookmarks, getAllCategories } from "@/lib/data";

// Component Imports
import { Main, Section, Container } from "@/components/craft";
import { BookmarkCard } from "@/components/bookmark-card";
import { BookmarkGrid } from "@/components/bookmark-grid";
import { CategoryFilter } from "@/components/category-filter";
import { EmailForm } from "@/components/email-form";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { SearchAndFilterSection } from "@/components/search-and-filter-section";

import Balancer from "react-wrap-balancer";

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const [bookmarks, categories] = await Promise.all([
    getAllBookmarks(),
    getAllCategories(),
  ]);

  const filteredBookmarks = bookmarks
    .filter(
      (bookmark) =>
        !searchParams.category ||
        bookmark.category?.id.toString() === searchParams.category,
    )
    .filter((bookmark) => {
      if (!searchParams.search) return true;
      const searchTerm = searchParams.search.toLowerCase();
      return (
        bookmark.title.toLowerCase().includes(searchTerm) ||
        bookmark.description?.toLowerCase().includes(searchTerm) ||
        bookmark.category?.name.toLowerCase().includes(searchTerm) ||
        bookmark.overview?.toLowerCase().includes(searchTerm) ||
        bookmark.tags?.toLowerCase().includes(searchTerm)
      );
    });

  return (
    <Main>
      <AnalyticsTracker pageType="home" />
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl space-y-8 text-center">
            <h1>
              <Balancer>
                Get the latest resources sent to your inbox weekly
              </Balancer>
            </h1>
            <EmailForm />
            <p className="text-sm text-muted-foreground">
              Join unusual-people · Unsubscribe anytime
            </p>
          </div>

          {/* Second Hero Section - Categories */}
          <div className="mt-16 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
            </div>
            <div className="flex justify-center">
              <Suspense fallback={<div>Loading categories...</div>}>
                <CategoryFilter
                  categories={categories.map((cat) => ({
                    id: cat.id.toString(),
                    name: cat.name,
                    color: cat.color || undefined,
                    icon: cat.icon || undefined,
                  }))}
                />
              </Suspense>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mt-16 space-y-6">
            <SearchAndFilterSection 
              bookmarks={filteredBookmarks}
              categories={categories}
            />
          </div>
        </Container>
      </Section>
    </Main>
  );
}
