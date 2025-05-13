"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import type { Post } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { deletePost } from "@/lib/firebase/posts";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostCardProps {
  post: Post;
  isOwner: boolean;
  onPostUpdated: () => void;
}

export function PostCard({ post, isOwner, onPostUpdated }: PostCardProps) {
  const router = useRouter();
  // const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      toast.success("Post deleted successfully");

      onPostUpdated();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post");

      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleClickOutside = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };

  const formattedDate = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "some time ago";

  return (
    <>
      <Card className={`overflow-hidden ${isOwner ? "border-primary/20" : ""}`}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex flex-1 items-center space-x-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={post.authorPhotoURL || undefined}
                alt={post.authorName}
              />
              <AvatarFallback>
                {post.authorName
                  ? post.authorName.charAt(0).toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.authorName}</p>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>

          {isOwner && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={handleClickOutside}
                  />
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border bg-card p-1 shadow-lg">
                    <button
                      className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        setShowMenu(false);
                        router.push(`/edit-post/${post.id}`);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </button>
                    <button
                      className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-left text-red-600 hover:bg-accent hover:text-red-600"
                      onClick={() => {
                        setShowMenu(false);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{post.content}</p>
          {post.imageUrl && (
            <div className="mt-4 overflow-hidden rounded-md">
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt="Post image"
                className="w-full object-cover"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4"></CardFooter>
      </Card>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
            <h2 className="mb-2 text-xl font-semibold">Are you sure?</h2>
            <p className="mb-6 text-muted-foreground">
              This action cannot be undone. This will permanently delete your
              post.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
