import type { ReactNode } from "react";
import { Sidebar } from "@/components/main/sidebar";
import { Navbar } from "@/components/main/navbar";
import { ProtectedRoute } from "@/components/main/protected-route";

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function MainLayout({ children, requireAuth = true }: MainLayoutProps) {
  const content = (
    <div className="flex ">
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl ">
            <Navbar />
            <main className="py-8 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );

  if (requireAuth) {
    return <ProtectedRoute>{content}</ProtectedRoute>;
  }

  return content;
}
