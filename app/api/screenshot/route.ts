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
    // Replace this URL with your actual Docker app endpoint
    const screenshotApiUrl = process.env.SCREENSHOT_API_URL || "http://your-docker-app-url:port/screenshot";
    
    const response = await fetch(screenshotApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`Screenshot API returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      imageUrl: data.imageUrl || data.url,
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
