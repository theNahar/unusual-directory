import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { userFavorites, bookmarks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyJWT } from "@/lib/auth";

// Get user's favorites or check if specific bookmark is favorited
export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies
    const authToken = request.cookies.get("auth-token")?.value;
    if (!authToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify JWT token
    const payload = await verifyJWT(authToken);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Check if checking specific bookmark
    const { searchParams } = new URL(request.url);
    const bookmarkId = searchParams.get("bookmarkId");

    if (bookmarkId) {
      // Check if specific bookmark is favorited
      const favorite = await db
        .select()
        .from(userFavorites)
        .where(
          and(
            eq(userFavorites.userId, payload.userId),
            eq(userFavorites.bookmarkId, parseInt(bookmarkId))
          )
        )
        .limit(1);

      return NextResponse.json({
        success: true,
        isFavorited: favorite.length > 0,
      });
    }

    // Get all user's favorites with bookmark details
    const favorites = await db
      .select({
        id: userFavorites.id,
        bookmarkId: userFavorites.bookmarkId,
        createdAt: userFavorites.createdAt,
        bookmark: {
          id: bookmarks.id,
          title: bookmarks.title,
          slug: bookmarks.slug,
          url: bookmarks.url,
          description: bookmarks.description,
          favicon: bookmarks.favicon,
          ogImage: bookmarks.ogImage,
          overview: bookmarks.overview,
          tags: bookmarks.tags,
          isPromoted: bookmarks.isPromoted,
          visitCount: bookmarks.visitCount,
          favoriteCount: bookmarks.favoriteCount,
          isArchived: bookmarks.isArchived,
          createdAt: bookmarks.createdAt,
        },
      })
      .from(userFavorites)
      .innerJoin(bookmarks, eq(userFavorites.bookmarkId, bookmarks.id))
      .where(eq(userFavorites.userId, payload.userId))
      .orderBy(userFavorites.createdAt);

    return NextResponse.json({
      success: true,
      favorites,
    });

  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add bookmark to favorites
export async function POST(request: NextRequest) {
  try {
    // Get auth token from cookies
    const authToken = request.cookies.get("auth-token")?.value;
    if (!authToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify JWT token
    const payload = await verifyJWT(authToken);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const { bookmarkId } = await request.json();

    if (!bookmarkId) {
      return NextResponse.json(
        { error: "Bookmark ID is required" },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existingFavorite = await db
      .select()
      .from(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, payload.userId),
          eq(userFavorites.bookmarkId, bookmarkId)
        )
      )
      .limit(1);

    if (existingFavorite.length > 0) {
      return NextResponse.json(
        { error: "Bookmark is already in favorites" },
        { status: 409 }
      );
    }

    // Add to favorites
    await db.insert(userFavorites).values({
      userId: payload.userId,
      bookmarkId,
      createdAt: new Date(),
    });

    // Update bookmark favorite count
    const currentBookmark = await db
      .select({ favoriteCount: bookmarks.favoriteCount })
      .from(bookmarks)
      .where(eq(bookmarks.id, bookmarkId))
      .limit(1);

    if (currentBookmark.length > 0) {
      await db
        .update(bookmarks)
        .set({
          favoriteCount: (currentBookmark[0].favoriteCount || 0) + 1,
        })
        .where(eq(bookmarks.id, bookmarkId));
    }

    return NextResponse.json({
      success: true,
      message: "Added to favorites",
    });

  } catch (error) {
    console.error("Add favorite error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Remove bookmark from favorites
export async function DELETE(request: NextRequest) {
  try {
    // Get auth token from cookies
    const authToken = request.cookies.get("auth-token")?.value;
    if (!authToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify JWT token
    const payload = await verifyJWT(authToken);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const bookmarkId = searchParams.get("bookmarkId");

    if (!bookmarkId) {
      return NextResponse.json(
        { error: "Bookmark ID is required" },
        { status: 400 }
      );
    }

    // Remove from favorites
    await db
      .delete(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, payload.userId),
          eq(userFavorites.bookmarkId, parseInt(bookmarkId))
        )
      );

    // Update bookmark favorite count
    const currentBookmark = await db
      .select({ favoriteCount: bookmarks.favoriteCount })
      .from(bookmarks)
      .where(eq(bookmarks.id, parseInt(bookmarkId)))
      .limit(1);

    if (currentBookmark.length > 0) {
      await db
        .update(bookmarks)
        .set({
          favoriteCount: Math.max(0, (currentBookmark[0].favoriteCount || 0) - 1),
        })
        .where(eq(bookmarks.id, parseInt(bookmarkId)));
    }

    return NextResponse.json({
      success: true,
      message: "Removed from favorites",
    });

  } catch (error) {
    console.error("Remove favorite error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
