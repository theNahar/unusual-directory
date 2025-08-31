import { NextRequest, NextResponse } from "next/server";
import { verifyUserEmail, createJWT, updateLastSignIn } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json();

    // Validate input
    if (!token || !email) {
      return NextResponse.json(
        { error: "Token and email are required" },
        { status: 400 }
      );
    }

    // Verify the token
    const result = await verifyUserEmail(token);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Check if user exists
    if (!result.user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update last sign in
    await updateLastSignIn(result.user.id);

    // Create JWT token
    const jwtToken = await createJWT({
      userId: result.user.id,
      email: result.user.email,
      emailVerified: result.user.emailVerified,
    });

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: result.user.id,
        email: result.user.email,
        emailVerified: result.user.emailVerified,
      },
    });

    // Set secure cookie
    response.cookies.set("auth-token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
