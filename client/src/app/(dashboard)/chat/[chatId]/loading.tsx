"use client"
import MessageSkeleton from "@/components/chat/MessageSkeleton";

export default function ChatConversationLoading() {
  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] flex-col">
      <MessageSkeleton />
    </div>
  );
}
