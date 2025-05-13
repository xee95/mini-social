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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
        if (fetchedPost.imageUrl) {
          setImagePreview(fetchedPost.imageUrl);
        }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Post content cannot be empty");

      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = post.imageUrl;

      if (!imagePreview && post.imageUrl) {
        imageUrl = null;
      }

      if (imageFile) {
        imageUrl = await uploadImage(
          imageFile,
          `posts/${user!.uid}/${Date.now()}`
        );
      }

      await updatePost(postId, {
        content,
        imageUrl,
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

                <div className="space-y-2">
                  <Label htmlFor="image">Add an image (optional)</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <ImageIcon size={16} />
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </Button>
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <Input
                    ref={fileInputRef}
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview && (
                    <div className="mt-2 overflow-hidden rounded-md border">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-64 w-full object-cover"
                      />
                    </div>
                  )}
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
