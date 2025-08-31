import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { users, userFavorites } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Get all users with their favorite counts
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        lastSignIn: users.lastSignIn,
        favoriteCount: sql<number>`COALESCE((
          SELECT COUNT(*) 
          FROM ${userFavorites} 
          WHERE ${userFavorites.userId} = ${users.id}
        ), 0)`,
      })
      .from(users)
      .orderBy(users.createdAt);

    return NextResponse.json({
      success: true,
      users: allUsers,
    });

  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
