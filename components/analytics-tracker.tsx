"use client";

import { useEffect } from "react";
import { useUser } from "@/lib/user-context";

interface AnalyticsTrackerProps {
  pageType: "home" | "category" | "bookmark" | "favorites";
  bookmarkId?: number;
}

export function AnalyticsTracker({ pageType, bookmarkId }: AnalyticsTrackerProps) {
  const { user } = useUser();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "page_view",
            bookmarkId: bookmarkId || null,
            sessionId: sessionStorage.getItem("sessionId") || null,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
          }),
        });
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    };

    trackPageView();
  }, [pageType, bookmarkId]);

  return null; // This component doesn't render anything
}
