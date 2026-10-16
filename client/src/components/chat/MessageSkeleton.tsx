import { Skeleton } from "@/components/ui/skeleton";

type MessageSkeletonProps = {
  count?: number;
};

const MessageSkeleton = ({ count = 5 }: MessageSkeletonProps) => {
  return (
    <div className="space-y-6 px-5 py-5" aria-label="Loading messages">
      {Array.from({ length: count }, (_, index) => {
        const isOutgoing = index % 2 === 1;

        return (
          <div
            className={`flex items-end gap-3 ${isOutgoing ? "justify-end" : ""}`}
            key={index}
          >
            {!isOutgoing && (
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            )}
            <div
              className={`space-y-2 ${isOutgoing ? "items-end" : ""} flex flex-col`}
            >
              <Skeleton
                className={`h-3 ${isOutgoing ? "w-16" : "w-24"}`}
              />
              <Skeleton
                className={`h-10 ${
                  isOutgoing
                    ? "w-44 rounded-br-sm"
                    : "w-56 rounded-bl-sm"
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageSkeleton;
