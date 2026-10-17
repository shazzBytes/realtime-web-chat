"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

function DashboardLayoutContent({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-svh bg-muted/30">
      <Navbar />
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1600px]">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense
      fallback={
        <div className="min-h-svh bg-muted/30">
          <Navbar />
          <main className="mx-auto max-w-[1600px] p-6">Loading workspace…</main>
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
