"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { getUserPosts } from "@/lib/firebase/posts";
import { MainLayout } from "@/components/layout/main-layout";
import { useAppSelector } from "@/lib/redux/hooks";
import type { Post } from "@/types";

export default function ProfilePage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const userPosts = await getUserPosts(user.uid);
          setPosts(userPosts);
          console.log("User posts refreshed, count:", userPosts.length);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    if (user) {
      setIsLoading(true);
      try {
        const userPosts = await getUserPosts(user.uid);
        setPosts(userPosts);
        console.log("User posts refreshed, count:", userPosts.length);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePostUpdated = () => {
    console.log("Post updated, refreshing profile posts...");
    fetchUserPosts();
  };

  return (
    <MainLayout>
      <div className=" bg-background">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">My Profile</h1>
              {user && (
                <>
                  <p>
                    <span className="font-semibold">Name: </span>
                    <span className="text-muted-foreground">
                      {user.displayName}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Email: </span>
                    <span className="text-muted-foreground">{user.email}</span>
                  </p>
                </>
              )}
            </div>
            <Button onClick={() => router.push("/create-post")}>
              Create New Post
            </Button>
          </div>

          <h2 className="mb-4 text-xl font-semibold">My Posts</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              Loading your posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                You haven&apos;t created any posts yet.
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push("/create-post")}
              >
                Create Your First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-6 ">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isOwner={true}
                  onPostUpdated={handlePostUpdated}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
