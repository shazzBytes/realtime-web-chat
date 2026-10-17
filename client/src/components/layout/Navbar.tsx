"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDrawerMounted, setIsDrawerMounted] = useState(false);
  const [shouldAnimateIn, setShouldAnimateIn] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    setIsDrawerMounted(true);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isDrawerMounted || !isMenuOpen) return;

    const frame = requestAnimationFrame(() => {
      setShouldAnimateIn(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [isDrawerMounted, isMenuOpen]);

  const closeMenu = () => {
    setShouldAnimateIn(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 shrink-0 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6 md:h-16">
          <div className="flex items-center gap-3">
            {/* Tablet hamburger */}
            <Button
              aria-label="Open navigation"
              className="hidden sm:inline-flex md:hidden"
              size="icon"
              variant="ghost"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu />
            </Button>

            {/* Brand */}
            <Link
              href="/chat"
              className="flex items-center gap-2 font-semibold tracking-tight"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MessageCircle className="size-5" />
              </span>

              <span>Realtime Chat</span>
            </Link>
          </div>

          {/* Placeholder profile */}
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            U
          </div>
        </div>
      </header>

      {/* Tablet navigation drawer */}
      {isDrawerMounted && (
        <div
          className={cn(
            "fixed inset-0 z-50 hidden sm:block md:hidden",
            shouldAnimateIn
              ? "pointer-events-auto"
              : "pointer-events-none",
          )}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation"
            tabIndex={shouldAnimateIn ? 0 : -1}
            className={cn(
              "absolute inset-0 bg-black/40 transition-opacity duration-300 ease-in-out",
              shouldAnimateIn ? "opacity-100" : "opacity-0",
            )}
            onClick={closeMenu}
          />

          {/* Sidebar drawer */}
          <aside
            onTransitionEnd={(event) => {
              if (
                event.target === event.currentTarget &&
                !shouldAnimateIn &&
                !isMenuOpen
              ) {
                setIsDrawerMounted(false);
              }
            }}
            className={cn(
              "absolute inset-y-0 left-0 w-72 border-r bg-background p-4 shadow-xl",
              "transition-transform duration-300 ease-in-out",
              shouldAnimateIn ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <Button
              type="button"
              aria-label="Close navigation"
              className="absolute right-3 top-3 z-10"
              size="icon"
              variant="ghost"
              onClick={closeMenu}
            >
              <X />
            </Button>

            <Sidebar
              className="!block h-full w-full border-0 pt-10"
              onNavigate={closeMenu}
            />
          </aside>
        </div>
      )}
    </>
  );
}
