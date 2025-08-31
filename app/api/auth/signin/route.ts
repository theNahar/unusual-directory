import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, generateSigninToken } from "@/lib/auth";
import { sendSigninEmail } from "@/lib/email";

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    return data.success && data.score >= 0.5; // reCAPTCHA v3 threshold
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, recaptchaToken } = await request.json();

    // Validate input
    if (!email || !recaptchaToken) {
      return NextResponse.json(
        { error: "Email and reCAPTCHA token are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign up instead." },
        { status: 404 }
      );
    }

    // Generate signin verification token
    const tokenResult = await generateSigninToken(email);
    if (!tokenResult.success) {
      return NextResponse.json(
        { error: tokenResult.error },
        { status: 500 }
      );
    }

    // Send signin email
    if (!tokenResult.verificationToken) {
      return NextResponse.json(
        { error: "Failed to generate verification token" },
        { status: 500 }
      );
    }
    
    const emailResult = await sendSigninEmail(email, tokenResult.verificationToken);
    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Failed to send signin email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Signin email sent successfully",
    });

  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
