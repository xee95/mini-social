import { Feed } from "@/components/feed";
import { MainLayout } from "@/components/layout/main-layout";

export default function Home() {
  return (
    <MainLayout>
      <main className=" bg-background">
        <div className="mx-auto max-w-3xl">
          <Feed />
        </div>
      </main>
    </MainLayout>
  );
}
