import EditPostClient from "./components/edit-post-client";

// Server component that passes the ID to the client component
export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <EditPostClient postId={id} />;
}
