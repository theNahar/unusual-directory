"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star, Archive, ExternalLink, Bookmark, Heart, Smile, Megaphone } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";

interface BookmarkCardProps {
  bookmark: {
    id: number;
    url: string;
    title: string;
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
    slug: string;
  };
  onRemoveFavorite?: (bookmarkId: number) => void;
  showFavoriteButton?: boolean;
}

export const BookmarkCard = ({ 
  bookmark, 
  onRemoveFavorite, 
  showFavoriteButton = false 
}: BookmarkCardProps) => {
  const { user } = useUser();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const detailsUrl = `/${bookmark.slug}`;
  const externalUrl = bookmark.url;

  // Check if bookmark is favorited on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !showFavoriteButton) return;
      
      try {
        const response = await fetch(`/api/favorites?bookmarkId=${bookmark.id}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorited(data.isFavorited || false);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [user, bookmark.id, showFavoriteButton]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error("Please sign in to manage favorites");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?bookmarkId=${bookmark.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorited(false);
          toast.success("Removed from favorites");
          onRemoveFavorite?.(bookmark.id);
        } else {
          toast.error("Failed to remove from favorites");
        }
      } else {
        // Add to favorites
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookmarkId: bookmark.id }),
        });

        if (response.ok) {
          setIsFavorited(true);
          toast.success("Added to favorites");
        } else {
          toast.error("Failed to add to favorites");
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "not-prose",
        "group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card",
        "transition-all duration-300 hover:shadow-lg",
        "hover:ring-2 hover:ring-accent hover:ring-offset-2",
        bookmark.isArchived && "opacity-75 hover:opacity-100",
      )}
    >
      {/* Promotion Badge */}
      {bookmark.isPromoted && (
        <div className="absolute left-3 top-3 z-10">
          <Badge
            className="bg-purple-500 text-white border-0"
            style={{ width: '32px', height: '32px', borderRadius: '4px' }}
          >
            <Megaphone className="h-3 w-3 text-white" />
          </Badge>
        </div>
      )}

      {/* Archive Badge */}
      {bookmark.isArchived && (
        <div className="absolute right-3 top-3 z-10">
          <Badge
            variant="secondary"
            className="bg-gray-500/10 text-gray-500 backdrop-blur-sm"
            style={{ width: '32px', height: '32px', borderRadius: '4px' }}
          >
            <Archive className="h-3 w-3" aria-label="Archived bookmark" />
          </Badge>
        </div>
      )}

      {/* Preview Image Container */}
      <Link
        href={detailsUrl}
        className="relative aspect-video w-full overflow-hidden border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`View details for ${bookmark.title}`}
      >
        {bookmark.ogImage ? (
          <img
            src={bookmark.ogImage}
            alt="Open Graph preview"
            width={300}
            height={200}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Bookmark
              className="h-8 w-8 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        )}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title and Description */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            {bookmark.favicon ? (
              <img
                src={bookmark.favicon}
                alt="Site favicon"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            ) : (
              <Bookmark
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            )}
            <h2 className="font-semibold leading-tight tracking-tight flex-1">
              {bookmark.title}
            </h2>
            {bookmark.category && (
              <Badge
                style={{
                  backgroundColor:
                    bookmark.category.color || "hsl(var(--primary))",
                  color: "white",
                }}
                className="w-fit"
              >
                {bookmark.category.icon} {bookmark.category.name}
              </Badge>
            )}
          </div>
          {bookmark.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {bookmark.description}
            </p>
          )}
        </div>

                  {/* Bottom Section */}
          <div className="space-y-3 pt-4">
            {/* Tags */}
            {bookmark.tags && (
              <div className="flex flex-wrap gap-1">
                {bookmark.tags.split(',').map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs"
                  >
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {showFavoriteButton && (
              <Button
                variant={isFavorited ? "default" : "outline"}
                size="sm"
                onClick={handleFavoriteToggle}
                disabled={isLoading}
                className="flex-shrink-0"
              >
                <Smile 
                  className={cn(
                    "h-4 w-4",
                    isFavorited ? "fill-current" : ""
                  )} 
                />
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 font-medium"
              asChild
            >
              <Link href={detailsUrl}>View Details</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 font-medium"
              asChild
            >
              <Link
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
