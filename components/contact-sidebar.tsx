"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Flag, Mail } from "lucide-react";
import { useUser } from "@/lib/user-context";

interface ContactSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactSidebar({ isOpen, onOpenChange }: ContactSidebarProps) {
  const { user } = useUser();
  const [email, setEmail] = useState(user?.email || "");
  const [listingName, setListingName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !listingName || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement contact form submission API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Report submitted successfully");
      setEmail(user?.email || "");
      setListingName("");
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Report Form
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={!!user}
            />
          </div>

          {/* Listing Name */}
          <div className="space-y-2">
            <Label htmlFor="listing">Listing Name</Label>
            <Select value={listingName} onValueChange={setListingName}>
              <SelectTrigger>
                <SelectValue placeholder="Select a listing to report" />
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

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Report Details</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe the issue with this listing..."
              rows={4}
            />
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
                Submit Report
              </>
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
