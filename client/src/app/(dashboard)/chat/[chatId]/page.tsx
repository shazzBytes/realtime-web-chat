import { Suspense } from "react";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full min-h-[calc(100vh-4rem)] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading messages…</p>
        </div>
      }
    >
    </Suspense>
  );
}
