"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/firebase/posts";
import type { Post } from "@/types";
import { PlusCircle, RefreshCw } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";

export function Feed() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsRefreshing(true);
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
      console.log("Posts refreshed, count:", fetchedPosts.length);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handlePostUpdated = () => {
    console.log("Post updated, refreshing feed...");
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Recent Posts</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPosts}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          {user && (
            <Button
              size="sm"
              onClick={() => router.push("/create-post")}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              New Post
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No posts yet. Be the first to post!
          </p>
          {user ? (
            <Button
              className="mt-4"
              onClick={() => router.push("/create-post")}
            >
              Create Post
            </Button>
          ) : (
            <Button className="mt-4" onClick={() => router.push("/login")}>
              Login to Post
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const isUserPost = user ? user.uid === post.authorId : false;

            return (
              <PostCard
                key={post.id}
                post={post}
                isOwner={isUserPost}
                onPostUpdated={handlePostUpdated}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
