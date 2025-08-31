import React from "react";
import { BookmarkCard } from "./bookmark-card";

interface Bookmark {
  id: number;
  title: string;
  slug: string;
  url: string;
  description?: string | null;
  category?: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
  } | null;
  tags?: string | null;
  favicon?: string | null;
  overview?: string | null;
  ogImage?: string | null;
  isArchived: boolean;
  isPromoted?: boolean;
  visitCount?: number;
  favoriteCount?: number;
}

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  onRemoveFavorite?: (bookmarkId: number) => void;
  showFavoriteButton?: boolean;
}

export const BookmarkGrid = ({ 
  bookmarks, 
  onRemoveFavorite, 
  showFavoriteButton = false 
}: BookmarkGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark, index) => (
        <div
          key={bookmark.id}
          className="fade-in h-full"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <BookmarkCard 
            bookmark={bookmark}
            onRemoveFavorite={onRemoveFavorite}
            showFavoriteButton={showFavoriteButton}
          />
        </div>
      ))}
    </div>
  );
};
