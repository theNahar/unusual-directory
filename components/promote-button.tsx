"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";
import { PromoteSidebar } from "@/components/promote-sidebar";

export function PromoteButton() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsSidebarOpen(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Megaphone className="h-4 w-4 mr-2" />
        Promote
      </Button>

      <PromoteSidebar 
        isOpen={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen} 
      />
    </>
  );
}
