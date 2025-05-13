import { use } from "react";
import EditPostClient from "./components/edit-post-client";

// Server component that passes the ID to the client component
export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <EditPostClient postId={id} />;
}
