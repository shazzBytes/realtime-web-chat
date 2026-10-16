import MessageSkeleton from "@/components/chat/MessageSkeleton";

export default function ChatLoading() {
  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] flex-col">
      <MessageSkeleton />
    </div>
  );
}
