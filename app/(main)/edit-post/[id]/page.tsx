import EditPostClient from "./components/edit-post-client";
interface PageProps {
  params: { id: string };
}
// Server component that passes the ID to the client component
export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  return <EditPostClient postId={id} />;
}
