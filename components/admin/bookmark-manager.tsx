"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createBookmark,
  updateBookmark,
  deleteBookmark,
  generateContent,
  bulkUploadBookmarks,
  type ActionState,
} from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Upload, Loader2, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

interface Bookmark {
  id: number;
  title: string;
  slug: string;
  url: string;
  description: string | null;
  overview: string | null;
  search_results: string | null;
  favicon: string | null;
  ogImage: string | null;
  categoryId: string | null;
  tags: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  notes: string | null;
}

interface BookmarkWithCategory extends Bookmark {
  category: Category | null;
}

interface BookmarkManagerProps {
  categories: Category[];
  bookmarks: BookmarkWithCategory[];
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BookmarkManager({
  bookmarks,
  categories,
}: BookmarkManagerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isBulkSheetOpen, setIsBulkSheetOpen] = useState(false);

  const [bulkUploadState, setBulkUploadState] = useState<ActionState | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const [bookmarkToDelete, setBookmarkToDelete] =
    useState<BookmarkWithCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedBookmark, setSelectedBookmark] =
    useState<BookmarkWithCategory | null>(null);
  const [isNewBookmark, setIsNewBookmark] = useState(true);

  useEffect(() => {
    if (bulkUploadState?.success) {
      if (
        bulkUploadState.progress?.current === bulkUploadState.progress?.total
      ) {
        toast.success(
          bulkUploadState.message || "Bookmarks uploaded successfully",
        );
        setIsUploading(false);
        setIsSheetOpen(false);
        setBulkUploadState(null);
      } else if (bulkUploadState.progress?.lastAdded) {
        toast.success(`Added: ${bulkUploadState.progress.lastAdded}`);
      }
    } else if (bulkUploadState?.error) {
      toast.error(bulkUploadState.error);
      if (
        !bulkUploadState.progress ||
        bulkUploadState.progress.current === bulkUploadState.progress.total
      ) {
        setIsUploading(false);
      }
    }
  }, [bulkUploadState]);

  // Form state management
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    url: "",
    description: "",
    overview: "",
    search_results: "",
    ogImage: "",
    imageUrl: "", // New field for screenshot API URL
    categoryId: "none",
    tags: "",
    isFavorite: false,
    isArchived: false,
  });

  // Screenshot API state
  const [isTakingScreenshot, setIsTakingScreenshot] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);

  // Screenshot API function
  const takeScreenshot = async (url: string) => {
    try {
      setIsTakingScreenshot(true);
      setScreenshotError(null);
      
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.success && data.imageUrl) {
        setFormData(prev => ({
          ...prev,
          ogImage: data.imageUrl,
        }));
        toast.success('Screenshot taken successfully!');
      } else {
        throw new Error(data.error || 'Failed to take screenshot');
      }
    } catch (error) {
      console.error('Error taking screenshot:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to take screenshot';
      setScreenshotError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsTakingScreenshot(false);
    }
  };

  // Handle image processing
  const handleImageProcess = async () => {
    if (!formData.imageUrl && !uploadedImage) {
      toast.error('Please provide either a URL for screenshot or upload an image');
      return;
    }

    if (formData.imageUrl && uploadedImage) {
      // If both are provided, prioritize URL
      await takeScreenshot(formData.imageUrl);
      return;
    }

    if (formData.imageUrl) {
      // Take screenshot from URL
      await takeScreenshot(formData.imageUrl);
    } else if (uploadedImage) {
      // Handle uploaded image (you can implement file upload logic here)
      // For now, we'll just set a placeholder
      setFormData(prev => ({
        ...prev,
        ogImage: URL.createObjectURL(uploadedImage),
      }));
      toast.success('Image uploaded successfully!');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      const formDataObject = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        url: formData.get("url") as string,
        slug: formData.get("slug") as string,
        overview: formData.get("overview") as string,

        ogImage: formData.get("ogImage") as string,
        imageUrl: formData.get("imageUrl") as string,
        search_results: formData.get("search_results") as string,
        categoryId: formData.get("categoryId") as string,
        tags: formData.get("tags") as string,
        isFavorite: formData.get("isFavorite") ? "true" : "false",
        isArchived: formData.get("isArchived") ? "true" : "false",
      };

      if (!isNewBookmark) {
        (formDataObject as any).id = formData.get("id") as string;
      }

      const result = isNewBookmark
        ? await createBookmark(null, formDataObject)
        : await updateBookmark(null, formDataObject as any);

      if (result && result.error) {
        toast.error(result.error);
      } else if (result && result.success) {
        toast.success(
          isNewBookmark ? "Bookmark created!" : "Bookmark updated!",
        );
        setIsSheetOpen(false);
        resetForm();
      } else {
        toast.error("Failed to save bookmark");
      }
    } catch (err) {
      console.error("Error saving bookmark:", err);
      toast.error("Failed to save bookmark");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form when sheet opens/closes
  useEffect(() => {
    if (isSheetOpen) {
      if (selectedBookmark) {
        setFormData({
          title: selectedBookmark.title,
          slug: selectedBookmark.slug,
          url: selectedBookmark.url,
          description: selectedBookmark.description || "",
          overview: selectedBookmark.overview || "",
          search_results: selectedBookmark.search_results || "",
          ogImage: selectedBookmark.ogImage || "",
          imageUrl: "",
          categoryId: selectedBookmark.categoryId?.toString() || "none",
          tags: selectedBookmark.tags || "",
          isFavorite: selectedBookmark.isFavorite,
          isArchived: selectedBookmark.isArchived,
        });
      } else {
        resetForm();
      }
    }
  }, [isSheetOpen, selectedBookmark]);

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      url: "",
      description: "",
      overview: "",
      search_results: "",
      ogImage: "",
      imageUrl: "",
      categoryId: "none",
      tags: "",
      isFavorite: false,
      isArchived: false,
    });
    setUploadedImage(null);
  };

  const handleEdit = (bookmark: BookmarkWithCategory) => {
    setSelectedBookmark(bookmark);
    setIsNewBookmark(false);
    setIsSheetOpen(true);
  };

  const handleNew = () => {
    setSelectedBookmark(null);
    setIsNewBookmark(true);
    setIsSheetOpen(true);
  };

  const handleDelete = async (bookmark: BookmarkWithCategory) => {
    setIsDeleting(true);
    setBookmarkToDelete(bookmark);

    try {
      const deleteData = {
        id: bookmark.id.toString(),
        url: bookmark.url,
      };
      const result = await deleteBookmark(null, deleteData);

      if (result.success) {
        toast.success("Bookmark deleted!");
        setBookmarkToDelete(null);
      } else {
        toast.error(result.error || "Failed to delete bookmark");
      }
    } catch (err) {
      console.error("Error deleting bookmark:", err);
      toast.error("Failed to delete bookmark");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let url = e.target.value.trim();
    if (url && !url.match(/^https?:\/\//)) {
      url = `https://${url}`;
    }
    setFormData((prev) => ({ ...prev, url }));
  };

  const handleGenerateContent = async (form: HTMLFormElement) => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      const formData = new FormData(form);
      const url = formData.get("url") as string;

      if (!url) {
        toast.error("Please enter a URL first");
        return;
      }

      // Create a new FormData with just the URL
      const data = new FormData();
      data.append("url", url);

      const result = await generateContent(url);

      if ("error" in result) {
        toast.error(result.error as string);
      } else {
        setFormData((prev) => ({
          ...prev,
          title: result.title || prev.title,
          description: result.description || prev.description,
          overview: result.overview || prev.overview,
          ogImage: result.ogImage || prev.ogImage,
          slug: result.slug || prev.slug,
        }));
        toast.success("Content generated successfully!");
      }
    } catch (err) {
      console.error("Error generating content:", err);
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      const text = await file.text();
      const urls = text
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url && !url.toLowerCase().startsWith("url")); // Skip header if present

      const result = await bulkUploadBookmarks(null, { urls: urls.join("\n") });

      if (result.success) {
        toast.success(result.message || "Bookmarks uploaded successfully");
        setIsBulkSheetOpen(false);
      } else {
        toast.error(result.error || "Failed to upload bookmarks");
      }

      setBulkUploadState(result);
    } catch (error) {
      toast.error("Failed to process the CSV file");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Manage Bookmarks</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsBulkSheetOpen(true)}
            size="sm"
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button onClick={handleNew} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Bookmark
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
                              <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookmarks.map((bookmark) => (
              <TableRow key={bookmark.id}>
                <TableCell className="font-medium">{bookmark.title}</TableCell>
                <TableCell>
                  {bookmark.category && (
                    <Badge
                      style={{
                        backgroundColor: bookmark.category.color || undefined,
                        color: "white",
                      }}
                    >
                      {bookmark.category.name}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {bookmark.tags && (
                    <div className="flex flex-wrap gap-1">
                      {bookmark.tags.split(',').map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {bookmark.isFavorite && (
                      <Badge variant="secondary">Favorite</Badge>
                    )}
                    {bookmark.isArchived && (
                      <Badge variant="secondary">Archived</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(bookmark)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(bookmark)}
                      disabled={
                        isDeleting && bookmarkToDelete?.id === bookmark.id
                      }
                    >
                      {isDeleting && bookmarkToDelete?.id === bookmark.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto max-h-screen">
          <SheetHeader>
            <SheetTitle>
              {isNewBookmark ? "Add Bookmark" : "Edit Bookmark"}
            </SheetTitle>
            <SheetDescription>
              {isNewBookmark
                ? "Add a new bookmark to your collection"
                : "Update the details of your bookmark"}
            </SheetDescription>
          </SheetHeader>

          <form
            id="bookmarkForm"
            onSubmit={handleSubmit}
            className="mt-6 space-y-6 pb-6"
          >
            <input type="hidden" name="id" value={selectedBookmark?.id || ""} />
            <input type="hidden" name="slug" value={formData.slug} />

            <div className="space-y-4">
              <div className="grid gap-4">
                {/* 1. Name (renamed from Title) */}
                <div className="space-y-2">
                  <Label htmlFor="title">Name</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Enter bookmark name"
                  />
                </div>

                {/* 2. Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Brief description of the bookmark"
                  />
                </div>

                {/* 3. Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    name="categoryId"
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, categoryId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Category</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tags: e.target.value,
                      }))
                    }
                    placeholder="Enter tags separated by commas (e.g., free, premium, tool, tutorial)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple tags with commas
                  </p>
                </div>

                {/* 5. Overview */}
                <div className="space-y-2">
                  <Label htmlFor="overview">Overview</Label>
                  <Textarea
                    id="overview"
                    name="overview"
                    value={formData.overview}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        overview: e.target.value,
                      }))
                    }
                    placeholder="Detailed overview or notes about the bookmark"
                  />
                </div>



                {/* 6. Image */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image</Label>
                  <div className="space-y-2">
                    {/* Screenshot URL Input */}
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          imageUrl: e.target.value,
                        }))
                      }
                      placeholder="https://example.com (for screenshot)"
                    />
                    
                    {/* File Upload */}
                    <div className="flex items-center gap-2">
                      <Input
                        id="imageUpload"
                        name="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadedImage(e.target.files?.[0] || null)}
                        className="flex-1"
                      />
                    </div>
                    
                    {/* Process Button */}
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleImageProcess}
                      disabled={isTakingScreenshot}
                      className="w-full"
                    >
                      {isTakingScreenshot ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Taking Screenshot...
                        </>
                      ) : (
                        "Process Image"
                      )}
                    </Button>
                  </div>
                  
                  {/* Display current image */}
                  {formData.ogImage && (
                    <div className="mt-2">
                      <Label className="text-sm text-muted-foreground">Current Image:</Label>
                      <img 
                        src={formData.ogImage} 
                        alt="Preview" 
                        className="mt-1 max-w-full h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                  
                  {/* Display error message */}
                  {screenshotError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      <strong>Error:</strong> {screenshotError}
                    </div>
                  )}
                </div>

                {/* 7. URL Field */}
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    required
                    value={formData.url}
                    onChange={handleUrlChange}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isFavorite"
                      name="isFavorite"
                      checked={formData.isFavorite}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isFavorite: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor="isFavorite">Favorite</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isArchived"
                      name="isArchived"
                      checked={formData.isArchived}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isArchived: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor="isArchived">Archived</Label>
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter>
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet open={isBulkSheetOpen} onOpenChange={setIsBulkSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Bulk Upload Bookmarks</SheetTitle>
            <SheetDescription>
              Upload a CSV file with a list of URLs to import. Each URL will be
              processed with a short delay to avoid rate limits.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleBulkUpload} className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Upload CSV File</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".csv,text/csv"
                  required
                  disabled={isUploading}
                />
                <p className="text-sm text-muted-foreground">
                  Upload a CSV file with a list of URLs (one per line). The
                  first row can optionally contain a header.
                </p>
              </div>

              {isUploading && (
                <div className="space-y-2 rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">
                      Processing URLs...
                    </span>
                  </div>
                  {bulkUploadState?.progress && (
                    <div className="text-sm text-muted-foreground">
                      Processing {bulkUploadState.progress.current} of{" "}
                      {bulkUploadState.progress.total} URLs
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    This may take a while. Please keep this window open.
                  </p>
                </div>
              )}
            </div>

            <SheetFooter>
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload and Process"
                  )}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
