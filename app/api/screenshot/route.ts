import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Call your Docker screenshot API
    const screenshotApiUrl = process.env.SCREENSHOT_API_URL || "https://shot.nahar.tv/shot";
    const authToken = process.env.SCREENSHOT_AUTH_TOKEN;
    
    if (!authToken) {
      return NextResponse.json(
        { error: "Screenshot API authentication not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(screenshotApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": authToken,
      },
      body: JSON.stringify({ 
        url,
        width: 1920,
        height: 1080,
        dpr: 1,
        format: 'jpeg',
        quality: 82
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Screenshot API returned ${response.status}: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      imageUrl: data.imageUrl,
    });

  } catch (error) {
    console.error("Error taking screenshot:", error);
    return NextResponse.json(
      { 
        error: "Failed to take screenshot",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
