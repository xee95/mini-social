"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { getPostById, updatePost } from "@/lib/firebase/posts";
import { uploadImage } from "@/lib/firebase/storage";
import { ImageIcon, Loader2 } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { useAppSelector } from "@/lib/redux/hooks";
import type { Post } from "@/types";
import { toast } from "sonner";

interface EditPostClientProps {
  postId: string;
}

export default function EditPostClient({ postId }: EditPostClientProps) {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(postId);
        if (!fetchedPost) {
          toast.error("Post not found");
          router.push("/");
          return;
        }

        setPost(fetchedPost);
        setContent(fetchedPost.content);
      } catch (error) {
        toast.error("Failed to load post");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, router, toast]);

  useEffect(() => {
    if (!isLoading && post && user && user.uid !== post.authorId) {
      toast.error("You can only edit your own posts");

      router.push("/");
    }
  }, [isLoading, post, user, router, toast]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Post content cannot be empty");

      return;
    }

    setIsSubmitting(true);

    try {
      await updatePost(postId, {
        content,
        updatedAt: new Date().toISOString(),
      });
      toast.success("Post updated successfully");

      router.push("/profile");
    } catch (error: any) {
      toast.error(error.message || "Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="flex flex-col gap-y-4">
          <Card className="w-full h-full ">
            <CardHeader>
              <CardTitle>Edit Post</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">What&apos;s on your mind?</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Post"
                    )}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
