"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { logoutUser } from "@/lib/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, PlusCircle, User, LogOut, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const navItems = [
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Create Post",
      href: "/create-post",
      icon: PlusCircle,
      requireAuth: true,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
      requireAuth: true,
    },
  ];

  return (
    <aside className="h-full bg-neutral-100 p-4 w-full dark:bg-neutral-900">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <MessageSquare className="h-6 w-6" />
          <span className="text-xl">Mini Social</span>
        </Link>
      </div>

      <div className="space-y-1 py-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">
          NAVIGATION
        </p>
        {navItems.map((item) => {
          if (item.requireAuth && !user) return null;
          const fullHref = item.href;
          const isActive = pathname === fullHref;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                  isActive &&
                    "bg-white shadow-sm hover:opacity-100 text-primary dark:bg-neutral-700"
                )}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.title}
              </div>
            </Link>
          );
        })}
      </div>

      {user && (
        <div className="mt-auto pt-4">
          <div className="rounded-lg border p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5" />
              <div className="truncate">
                <p className="text-sm font-medium">
                  {user.displayName || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full mt-2"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
