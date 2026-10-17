"use client";

import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const {
    data: chatData = [],
    isPending,
    isError,
  } = useChat();

  if (isPending) {
    return <p className="p-4 text-sm text-muted-foreground">
      Loading conversations...
    </p>;
  }

  if (isError) {
    return <p className="p-4 text-sm text-destructive">
      Unable to load conversations.
    </p>;
  }

  return (
    <div>
      {/* Pass chatData to your actual chat layout/sidebar */}
      <p>{chatData.length} conversations</p>
    </div>
  );
}