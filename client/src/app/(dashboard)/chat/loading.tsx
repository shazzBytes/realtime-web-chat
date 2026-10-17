export default function Loading() {
  return (
    <div className="flex h-full animate-pulse">
      {/* Sidebar skeleton */}
      <aside className="hidden w-72 shrink-0 border-r p-4 md:block">
        <div className="mb-6 h-10 rounded-lg bg-muted" />

        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="mb-4 flex items-center gap-3">
            <div className="size-10 rounded-full bg-muted" />

            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          </div>
        ))}
      </aside>

      {/* Chat area skeleton */}
      <main className="flex-1 p-6">
        <div className="h-12 rounded-lg bg-muted" />
      </main>
    </div>
  );
}