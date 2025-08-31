"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookmarkGrid } from "@/components/bookmark-grid";
import { useUser } from "@/lib/user-context";
import { AuthSidebar } from "@/components/auth-sidebar";
import { ContactSidebar } from "@/components/contact-sidebar";
import { Search, Smile, Flag, Clock, Heart } from "lucide-react";

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
  category: Category | null;
}

interface SearchAndFilterSectionProps {
  bookmarks: Bookmark[];
  categories: Category[];
}

type ViewMode = "all" | "recent" | "favorites";

export function SearchAndFilterSection({ bookmarks, categories }: SearchAndFilterSectionProps) {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Filter bookmarks based on search term
  const filteredBySearch = bookmarks.filter((bookmark) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      bookmark.title.toLowerCase().includes(term) ||
      bookmark.description?.toLowerCase().includes(term) ||
      bookmark.category?.name.toLowerCase().includes(term) ||
      bookmark.overview?.toLowerCase().includes(term) ||
      bookmark.tags?.toLowerCase().includes(term)
    );
  });

  // Filter bookmarks based on view mode
  const filteredByViewMode = filteredBySearch.filter((bookmark) => {
    switch (viewMode) {
      case "recent":
        // Show bookmarks from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return bookmark.createdAt >= thirtyDaysAgo;
      case "favorites":
        // This will be handled by the favorite filter
        return true;
      default:
        return true;
    }
  });

  // Sort bookmarks based on view mode
  const sortedBookmarks = [...filteredByViewMode].sort((a, b) => {
    switch (viewMode) {
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "favorites":
        return (b.favoriteCount || 0) - (a.favoriteCount || 0);
      default:
        return (b.favoriteCount || 0) - (a.favoriteCount || 0);
    }
  });

  const handleFavoriteToggle = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setShowFavorites(!showFavorites);
  };

  const handleReportClick = () => {
    setIsContactOpen(true);
  };

  const handleRemoveFavorite = (bookmarkId: number) => {
    // This will be handled by the BookmarkGrid component
  };

  return (
    <>
      <div className="space-y-6">
        {/* Search and Filter Controls */}
        <div className="flex items-center gap-4">
          {/* Favorite Button */}
          <Button
            variant={showFavorites ? "default" : "outline"}
            size="sm"
            onClick={handleFavoriteToggle}
            className="flex-shrink-0"
          >
            <Smile className="h-4 w-4" />
          </Button>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("recent")}
            >
              <Clock className="h-4 w-4 mr-1" />
              Recently Added
            </Button>
            <Button
              variant={viewMode === "favorites" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("favorites")}
            >
              <Heart className="h-4 w-4 mr-1" />
              Most Favorited
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReportClick}
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bookmarks Grid */}
        <BookmarkGrid 
          bookmarks={sortedBookmarks.map((bookmark) => ({
            id: bookmark.id,
            url: bookmark.url,
            title: bookmark.title,
            description: bookmark.description,
            category: bookmark.category
              ? {
                  id: bookmark.category.id.toString(),
                  name: bookmark.category.name,
                  color: bookmark.category.color || undefined,
                  icon: bookmark.category.icon || undefined,
                }
              : null,
            tags: bookmark.tags,
            favicon: bookmark.favicon,
            overview: bookmark.overview,
            ogImage: bookmark.ogImage,
            isArchived: bookmark.isArchived,
            isPromoted: bookmark.isPromoted,
            visitCount: bookmark.visitCount,
            favoriteCount: bookmark.favoriteCount,
            slug: bookmark.slug,
          }))}
          showFavoriteButton={true}
          onRemoveFavorite={handleRemoveFavorite}
        />

        {sortedBookmarks.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No bookmarks found
            {searchTerm && ` matching "${searchTerm}"`}
            {viewMode === "recent" && " in the last 30 days"}
            {viewMode === "favorites" && " with favorites"}
          </div>
        )}
      </div>

      {/* Auth Sidebar */}
      <AuthSidebar 
        isOpen={isAuthOpen} 
        onOpenChange={setIsAuthOpen} 
      />

      {/* Contact Sidebar */}
      <ContactSidebar 
        isOpen={isContactOpen} 
        onOpenChange={setIsContactOpen} 
      />
    </>
  );
}
