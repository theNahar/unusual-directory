"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Megaphone, Mail } from "lucide-react";
import { useUser } from "@/lib/user-context";

interface PromoteSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PromoteSidebar({ isOpen, onOpenChange }: PromoteSidebarProps) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("new");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Listing Form State
  const [newListingEmail, setNewListingEmail] = useState(user?.email || "");
  const [newListingName, setNewListingName] = useState("");
  const [newListingDescription, setNewListingDescription] = useState("");
  const [newListingUrl, setNewListingUrl] = useState("");
  const [newListingPeriod, setNewListingPeriod] = useState("");

  // Existing Listing Form State
  const [existingListingEmail, setExistingListingEmail] = useState(user?.email || "");
  const [existingListingName, setExistingListingName] = useState("");
  const [existingListingPeriod, setExistingListingPeriod] = useState("");

  const handleNewListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newListingEmail || !newListingName || !newListingDescription || !newListingUrl || !newListingPeriod) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement new listing promotion API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("New listing promotion request submitted successfully!");
      
      // Reset form
      setNewListingEmail(user?.email || "");
      setNewListingName("");
      setNewListingDescription("");
      setNewListingUrl("");
      setNewListingPeriod("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to submit promotion request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExistingListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!existingListingEmail || !existingListingName || !existingListingPeriod) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement existing listing promotion API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Existing listing promotion request submitted successfully!");
      
      // Reset form
      setExistingListingEmail(user?.email || "");
      setExistingListingName("");
      setExistingListingPeriod("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to submit promotion request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Promote
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">New Listing</TabsTrigger>
              <TabsTrigger value="existing">Existed Listing</TabsTrigger>
            </TabsList>

            {/* New Listing Tab */}
            <TabsContent value="new" className="space-y-6 mt-6">
              <form onSubmit={handleNewListingSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="new-email">Email</Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={newListingEmail}
                    onChange={(e) => setNewListingEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={!!user}
                  />
                </div>

                {/* Listing Name */}
                <div className="space-y-2">
                  <Label htmlFor="new-name">Listing Name</Label>
                  <Input
                    id="new-name"
                    value={newListingName}
                    onChange={(e) => setNewListingName(e.target.value)}
                    placeholder="Enter listing name"
                  />
                </div>

                {/* Listing Description */}
                <div className="space-y-2">
                  <Label htmlFor="new-description">Listing Description</Label>
                  <Textarea
                    id="new-description"
                    value={newListingDescription}
                    onChange={(e) => setNewListingDescription(e.target.value)}
                    placeholder="Enter listing description"
                    rows={3}
                  />
                </div>

                {/* Listing URL */}
                <div className="space-y-2">
                  <Label htmlFor="new-url">Listing URL</Label>
                  <Input
                    id="new-url"
                    type="url"
                    value={newListingUrl}
                    onChange={(e) => setNewListingUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                {/* Promotion Period */}
                <div className="space-y-2">
                  <Label htmlFor="new-period">Promotion Period</Label>
                  <Select value={newListingPeriod} onValueChange={setNewListingPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select promotion period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15-days">15 days</SelectItem>
                      <SelectItem value="1-month">1 month</SelectItem>
                      <SelectItem value="3-months">3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Submit Promotion Request
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Existing Listing Tab */}
            <TabsContent value="existing" className="space-y-6 mt-6">
              <form onSubmit={handleExistingListingSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="existing-email">Email</Label>
                  <Input
                    id="existing-email"
                    type="email"
                    value={existingListingEmail}
                    onChange={(e) => setExistingListingEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={!!user}
                  />
                </div>

                {/* Listing Name */}
                <div className="space-y-2">
                  <Label htmlFor="existing-name">Listing Name</Label>
                  <Select value={existingListingName} onValueChange={setExistingListingName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Search and select a listing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="example-listing-1">Example Listing 1</SelectItem>
                      <SelectItem value="example-listing-2">Example Listing 2</SelectItem>
                      <SelectItem value="example-listing-3">Example Listing 3</SelectItem>
                      <SelectItem value="example-listing-4">Example Listing 4</SelectItem>
                      <SelectItem value="example-listing-5">Example Listing 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Promotion Period */}
                <div className="space-y-2">
                  <Label htmlFor="existing-period">Promotion Period</Label>
                  <Select value={existingListingPeriod} onValueChange={setExistingListingPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select promotion period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15-days">15 days</SelectItem>
                      <SelectItem value="1-month">1 month</SelectItem>
                      <SelectItem value="3-months">3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Submit Promotion Request
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
