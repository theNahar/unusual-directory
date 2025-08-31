"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Edit, Eye, Loader2, Search } from "lucide-react";

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  lastSignIn: string | null;
  favoriteCount: number;
}

interface UserDetails {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  lastSignIn: string | null;
  favoriteCount: number;
}

export function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data.user);
        setEditingEmail(data.user.email);
        setIsDetailsOpen(true);
      } else {
        toast.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error fetching user details");
    }
  };

  const handleSaveEmail = async () => {
    if (!selectedUser || editingEmail === selectedUser.email) return;

    setSavingEmail(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: editingEmail }),
      });

      if (response.ok) {
        toast.success("Email updated successfully");
        setSelectedUser(prev => prev ? { ...prev, email: editingEmail } : null);
        // Update the user in the list
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? { ...user, email: editingEmail } : user
        ));
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update email");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Error updating email");
    } finally {
      setSavingEmail(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Signed Up</TableHead>
              <TableHead>Last Sign In</TableHead>
              <TableHead>Favorites</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.emailVerified ? "default" : "secondary"}>
                      {user.emailVerified ? "Verified" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{formatDate(user.lastSignIn)}</TableCell>
                  <TableCell>{user.favoriteCount}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(user.id)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="mt-6 space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    value={editingEmail}
                    onChange={(e) => setEditingEmail(e.target.value)}
                  />
                  <Button
                    onClick={handleSaveEmail}
                    disabled={editingEmail === selectedUser.email || savingEmail}
                    size="sm"
                  >
                    {savingEmail ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>

              {/* User ID */}
              <div className="space-y-2">
                <Label>User ID</Label>
                <Input value={selectedUser.id} disabled className="font-mono text-sm" />
              </div>

              {/* Sign Up Date */}
              <div className="space-y-2">
                <Label>Signed Up</Label>
                <Input value={formatDate(selectedUser.createdAt)} disabled />
              </div>

              {/* Last Sign In */}
              <div className="space-y-2">
                <Label>Last Sign In</Label>
                <Input value={formatDate(selectedUser.lastSignIn)} disabled />
              </div>

              {/* Favorite Count */}
              <div className="space-y-2">
                <Label>Favorite Count</Label>
                <Input value={selectedUser.favoriteCount.toString()} disabled />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Badge variant={selectedUser.emailVerified ? "default" : "secondary"}>
                  {selectedUser.emailVerified ? "Email Verified" : "Email Pending"}
                </Badge>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
