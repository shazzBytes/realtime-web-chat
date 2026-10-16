"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageCircle, Settings, Users, UserCircle } from "lucide-react";
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

  return (
    <aside className={cn("hidden w-64 shrink-0 border-e bg-background md:block", className)}>
      <div className="flex h-full flex-col p-4">
        <div className="mb-6 rounded-2xl bg-primary/5 p-4">
          <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LayoutDashboard className="size-5" />
          </div>
          <p className="text-sm font-semibold">Your workspace</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Keep conversations, groups, and your profile in one place.
          </p>
        </div>

        <nav aria-label="Dashboard navigation" className="space-y-1">
          {navigation.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                href={href}
                onClick={onNavigate}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border bg-card p-4">
          <p className="text-sm font-medium">Need a quick start?</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Open Messages to pick up where you left off.
          </p>
          <Link
            className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline"
            href="/chat"
            onClick={onNavigate}
          >
            Go to messages →
          </Link>
        </div>
      </div>
    </aside>
  );
}
