import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { analytics, bookmarks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyJWT } from "@/lib/auth";

// Track analytics event
export async function POST(request: NextRequest) {
  try {
    const { type, bookmarkId, sessionId, userAgent, ipAddress, referrer } = await request.json();

    if (!type) {
      return NextResponse.json(
        { error: "Event type is required" },
        { status: 400 }
      );
    }

    // Get user ID if authenticated
    let userId = null;
    const authToken = request.cookies.get("auth-token")?.value;
    if (authToken) {
      const payload = await verifyJWT(authToken);
      if (payload) {
        userId = payload.userId;
      }
    }

    // Create analytics record
    await db.insert(analytics).values({
      type,
      bookmarkId: bookmarkId || null,
      userId: userId || null,
      sessionId: sessionId || null,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      referrer: referrer || null,
      createdAt: new Date(),
    });

    // Update bookmark counters for specific events
    if (bookmarkId && (type === "bookmark_visit" || type === "bookmark_click")) {
      // Get current visit count and increment it
      const currentBookmark = await db
        .select({ visitCount: bookmarks.visitCount })
        .from(bookmarks)
        .where(eq(bookmarks.id, bookmarkId))
        .limit(1);

      if (currentBookmark.length > 0) {
        await db
          .update(bookmarks)
          .set({
            visitCount: (currentBookmark[0].visitCount || 0) + 1,
          })
          .where(eq(bookmarks.id, bookmarkId));
      }
    }

    return NextResponse.json({
      success: true,
      message: "Analytics event tracked",
    });

  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get analytics summary
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const bookmarkId = searchParams.get("bookmarkId");

    let whereConditions = [];

    if (type) {
      whereConditions.push(eq(analytics.type, type));
    }

    if (bookmarkId) {
      whereConditions.push(eq(analytics.bookmarkId, parseInt(bookmarkId)));
    }

    const events = await db
      .select()
      .from(analytics)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(analytics.createdAt);

    return NextResponse.json({
      success: true,
      events,
    });

  } catch (error) {
    console.error("Get analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
