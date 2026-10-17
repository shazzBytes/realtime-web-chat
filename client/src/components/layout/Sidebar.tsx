"use client";

import { cn } from "@/lib/utils";
import { MessageCircle, Settings, Users, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/chat", label: "Messages", icon: MessageCircle },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/chat"
      ? pathname === "/chat" || pathname.startsWith("/chat/")
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden w-64 shrink-0 border-e bg-background md:block",
          className,
        )}
      >
        <div className="flex h-full flex-col p-4 py-8">
          <nav aria-label="Dashboard navigation" className="space-y-1">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={isActive(href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(href)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
      >
        <div className="mx-auto grid h-16 max-w-lg grid-cols-4">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                isActive(href)
                  ? "font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                className={cn("size-5", isActive(href) && "stroke-[2.5]")}
              />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
