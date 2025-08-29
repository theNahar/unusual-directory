import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Screenshot API called");
    
    const { url } = await request.json();
    console.log("Request URL:", url);

    if (!url) {
      console.log("No URL provided");
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
    
    console.log("Environment variables:");
    console.log("- SCREENSHOT_API_URL:", screenshotApiUrl);
    console.log("- SCREENSHOT_AUTH_TOKEN exists:", !!authToken);
    console.log("- SCREENSHOT_AUTH_TOKEN value:", authToken ? `${authToken.substring(0, 10)}...` : "NOT SET");
    
    if (!authToken) {
      console.error("Screenshot API authentication not configured");
      return NextResponse.json(
        { error: "Screenshot API authentication not configured. Please set SCREENSHOT_AUTH_TOKEN environment variable." },
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
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Screenshot API error: ${response.status}`, errorData);
      throw new Error(`Screenshot API returned ${response.status}: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();

    // Download the image and save it locally
    if (data.imageUrl) {
      const imageResponse = await fetch(data.imageUrl);
      if (imageResponse.ok) {
        const imageBuffer = await imageResponse.arrayBuffer();
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const filename = `screenshot-${timestamp}-${randomString}.jpg`;
        
        // Save to local storage
        const { writeFile, mkdir } = await import("fs/promises");
        const { join } = await import("path");
        const { existsSync } = await import("fs");
        
        const imgDir = join(process.cwd(), "app", "img");
        if (!existsSync(imgDir)) {
          await mkdir(imgDir, { recursive: true });
        }
        
        const filePath = join(imgDir, filename);
        await writeFile(filePath, Buffer.from(imageBuffer));
        
        const localUrl = `/img/${filename}`;
        
        return NextResponse.json({
          success: true,
          imageUrl: localUrl,
        });
      }
    }

    // Fallback to external URL if local save fails
    return NextResponse.json({
      success: true,
      imageUrl: data.imageUrl,
    });

  } catch (error) {
    console.error("Error taking screenshot:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
                     { 
             error: "Screenshot request timed out. The API took too long to respond.",
             details: "Request timed out after 60 seconds"
           },
          { status: 504 }
        );
      }
      
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { 
            error: "Cannot connect to screenshot API. Please check if the API is running.",
            details: error.message
          },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: "Failed to take screenshot",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
