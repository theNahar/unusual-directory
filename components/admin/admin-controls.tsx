"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2, Shield, Database, Globe, Bell } from "lucide-react";
import { toast } from "sonner";

interface AdminControlsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminControls({ isOpen, onOpenChange }: AdminControlsProps) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Admin Controls
          </SheetTitle>
          <SheetDescription>
            Manage application settings and configurations
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Maintenance Mode */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Maintenance Mode
              </CardTitle>
              <CardDescription>
                Enable maintenance mode to restrict access to the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, only administrators can access the site
                  </p>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Database Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5" />
                Database Management
              </CardTitle>
              <CardDescription>
                Manage database operations and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Database Status</Label>
                  <p className="text-sm text-muted-foreground">
                    All systems operational
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Backup Database
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <i className="fas fa-upload mr-2"></i>
                Bulk Upload
              </Button>
            </CardContent>
          </Card>

          {/* Site Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5" />
                Site Settings
              </CardTitle>
              <CardDescription>
                Configure general site settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Analytics Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Track user behavior and site usage
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for important events
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>
                Current system status and version information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version:</span>
                <span>1.0.3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Environment:</span>
                <span>Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <SheetFooter className="mt-6">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
