"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";
import { BookmarkGrid } from "@/components/bookmark-grid";
import { Container } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FavoriteBookmark {
  id: number;
  bookmarkId: number;
  createdAt: string;
  bookmark: {
    id: number;
    title: string;
    slug: string;
    url: string;
    description: string | null;
    favicon: string | null;
    ogImage: string | null;
    overview: string | null;
    tags: string | null;
    isPromoted: boolean;
    visitCount: number;
    favoriteCount: number;
    isArchived: boolean;
    createdAt: string;
  };
}

export default function FavoritesPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteBookmark[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }

    if (user) {
      fetchFavorites();
    }
  }, [user, loading, router]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleRemoveFavorite = async (bookmarkId: number) => {
    try {
      const response = await fetch(`/api/favorites?bookmarkId=${bookmarkId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav.bookmarkId !== bookmarkId));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <Container className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Container>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Convert favorites to bookmark format for BookmarkGrid
  const bookmarkData = favorites.map(fav => ({
    ...fav.bookmark,
    category: null, // Favorites don't include category info
  }));

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500" />
              My Favorites
            </h1>
            <p className="text-muted-foreground">
              Your saved bookmarks and resources
            </p>
          </div>
        </div>

        {/* Content */}
        {loadingFavorites ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle>No favorites yet</CardTitle>
              <CardDescription>
                Start exploring and add some bookmarks to your favorites!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/">
                <Button>
                  Browse Bookmarks
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
              </p>
            </div>
            <BookmarkGrid 
              bookmarks={bookmarkData} 
              onRemoveFavorite={handleRemoveFavorite}
              showFavoriteButton={true}
            />
          </div>
        )}
      </div>
    </Container>
  );
}
