import { use } from "react";
import EditPostClient from "./components/edit-post-client";
interface PageProps {
  params: { id: string };
}
// Server component that passes the ID to the client component
export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <EditPostClient postId={id} />;
}
