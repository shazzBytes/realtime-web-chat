"use client";

import { useState } from "react";
import { Plus, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GroupsPage() {
  const [search, setSearch] = useState("");

  return (
    <section className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-4 py-6 sm:px-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Groups</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Chat with people together.
          </p>
        </div>

        <Button disabled title="Group creation will be available soon">
          <Plus />
          <span className="hidden sm:inline">New group</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </header>

      {/* Search */}
      <div className="relative mt-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          aria-label="Search groups"
          placeholder="Search groups..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9"
        />
      </div>

      {/* Empty state */}
      <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <Users className="size-6 text-muted-foreground" />
        </div>

        <h2 className="mt-4 text-base font-medium">
          {search ? "No groups found" : "No groups yet"}
        </h2>

        <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted-foreground">
          {search
            ? `No groups match "${search}". Try another search.`
            : "Create a group to bring your conversations together."}
        </p>
      </div>
    </section>
  );
}
