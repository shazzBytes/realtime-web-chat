"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, UserPlus, Sparkles } from "lucide-react";
import { useState } from "react";

export default function GroupsPage() {
  const [search, setSearch] = useState("");

  return (
    <section className="min-h-[calc(100svh-4rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              Collaborate together
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Groups</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Bring conversations together around the people and projects that matter.
            </p>
          </div>
          <Button disabled title="Group creation will be available when group APIs are connected">
            <UserPlus />
            Create group
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["0", "Your groups", "Groups you belong to"],
            ["0", "Active members", "Across your groups"],
            ["—", "Recent activity", "Coming with group chat"],
          ].map(([value, label, description]) => (
            <Card key={label} className="bg-background/80">
              <CardContent className="p-5">
                <p className="text-2xl font-semibold tracking-tight">{value}</p>
                <p className="mt-1 text-sm font-medium">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 overflow-hidden bg-background/80">
          <CardHeader className="border-b sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Your groups</CardTitle>
              <CardDescription>Groups you create or join will show up here.</CardDescription>
            </div>
            <div className="relative mt-3 w-full sm:mt-0 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search groups"
                className="pl-8"
                placeholder="Search groups"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-10">
            <div className="mx-auto flex max-w-md flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="size-8" />
              </div>
              <h2 className="mt-5 text-lg font-semibold">
                {search ? `No groups match “${search}”` : "Your group space is ready"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {search
                  ? "Try a different search term or clear the search to see all groups."
                  : "Once group conversations are connected, this is where you will find shared spaces, members, and recent activity."}
              </p>
              <Button className="mt-6" disabled title="Group creation will be available soon">
                <UserPlus />
                Create your first group
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
