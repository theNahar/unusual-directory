"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { useUser } from "@/lib/user-context";
import { AccountSidebar } from "@/components/account-sidebar";
import { AuthSidebar } from "@/components/auth-sidebar";

export function UserAccountButton() {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsSidebarOpen(true)}
        className="flex items-center gap-2"
      >
        <CircleUser className="h-4 w-4" />
      </Button>

      {user ? (
        <AccountSidebar 
          isOpen={isSidebarOpen} 
          onOpenChange={setIsSidebarOpen} 
        />
      ) : (
        <AuthSidebar 
          isOpen={isSidebarOpen} 
          onOpenChange={setIsSidebarOpen} 
        />
      )}
    </>
  );
}
