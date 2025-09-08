"use client"

import { useState } from "react";
import { StickyInterestLevel } from "@/components/ui/sticky-interest-level";
import { PageAnalyticsDevTools } from "@/components/ui/page-analytics-dev-tools";
import { DevToolsToggle } from "@/components/ui/dev-tools-toggle";

export function DevToolsWrapper() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showInterest, setShowInterest] = useState(false);

  return (
    <>
      {/* Dev Tools Toggle */}
      <DevToolsToggle 
        onToggleAnalytics={setShowAnalytics}
        onToggleInterest={setShowInterest}
      />
      
      {/* Dev Tools - Conditionally Rendered */}
      <div className="fixed top-48 left-4 z-40 w-80 space-y-3">
        {showInterest && <StickyInterestLevel />}
        {showAnalytics && <PageAnalyticsDevTools />}
      </div>
    </>
  );
}
