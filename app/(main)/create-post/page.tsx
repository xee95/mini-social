"use client";

import type React from "react";

import { useState, useRef } from "react";
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

import { createPost } from "@/lib/firebase/posts";
import { uploadImage } from "@/lib/firebase/storage";
import { ImageIcon, Loader2 } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { useAppSelector } from "@/lib/redux/hooks";
import { toast } from "sonner";

export default function CreatePostPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // toast({
      //   title: "Error",
      //   description: "Post content cannot be empty",
      //   variant: "destructive",
      // })
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(
          imageFile,
          `posts/${user!.uid}/${Date.now()}`
        );
      }

      await createPost({
        content,
        imageUrl,
        authorId: user!.uid,
        authorName: user!.displayName || "Anonymous",
        createdAt: new Date().toISOString(),
      });
      toast.success("Post created successfully");

      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className=" bg-background">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Post</CardTitle>
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
                      {imageFile ? "Change Image" : "Upload Image"}
                    </Button>
                    {imageFile && (
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
                        Posting...
                      </>
                    ) : (
                      "Post"
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
