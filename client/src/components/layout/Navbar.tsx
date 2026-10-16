"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              aria-label="Open navigation"
              className="md:hidden"
              size="icon"
              variant="ghost"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu />
            </Button>
            <Link className="flex items-center gap-2 font-semibold tracking-tight" href="/chat">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MessageCircle className="size-5" />
              </span>
              <span>Realtime Chat</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user?.username ?? "Welcome back"}</p>
              <p className="text-xs text-muted-foreground">Stay connected</p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user?.username?.slice(0, 1).toUpperCase() ?? "U"}
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMenuOpen(false)}
          />
          <aside className="relative h-full w-72 border-e bg-background p-4 shadow-xl">
            <Button
              aria-label="Close navigation"
              className="absolute right-3 top-3"
              size="icon"
              variant="ghost"
              onClick={() => setIsMenuOpen(false)}
            >
              <X />
            </Button>
            <Sidebar className="!block w-full border-0" onNavigate={() => setIsMenuOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
