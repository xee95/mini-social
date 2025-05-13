"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileSidebar } from "@/components/main/mobile-sidebar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();

  // Get the current page title
  const getPageTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname === "/profile") return "Profile";
    if (pathname === "/create-post") return "Create Post";
    return "Mini Social";
  };

  return (
    <nav className="w-full border-b ">
      <div className=" h-16 md:px-6 flex items-center justify-between ">
        <div className="mr-4  flex items-center">
          <MobileSidebar />
          <div className="flex-col flex justify-center md:ml-2 lg:ml-0 ">
            <h1 className="text-lg md:text-2xl font-semibold">
              {getPageTitle()}
            </h1>
            <p className="hidden md:block text-muted-foreground">
              {pathname === "/" && "See what's happening in your network"}
              {pathname === "/profile" && "Manage your profile and posts"}
              {pathname === "/create-post" &&
                "Share your thoughts with the world"}
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="flex items-center">
            <ThemeToggle />

            {!user && (
              <Link href="/login">
                <Button variant="default" size="sm" className="ml-2">
                  Login
                </Button>
              </Link>
            )}

            {user && (
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  aria-label="Profile"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
