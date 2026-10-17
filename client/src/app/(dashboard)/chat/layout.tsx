"use client"
import {useChat} from "@/hooks/useChat";
import { useAuthStore } from "@/store/authStore";

export default function ChatLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
  <>{children}</>
  );
}

function ConversationList() {
  
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const {
    data: chatData = [],
    isPending: isChatsLoading,
    isError,
  } = useChat();

  if (isAuthLoading) {
    return <p>Checking authenticattion...</p>;
  }
  if (isChatsLoading) {
    return <p>Loading conversations...</p>
  }
  if (isError) {
    return <p>Unable to load conversations.</p>
  }
  return (
    <div>
      {chatData.map((chat)=> (
        <p key={chat.id}>{chat.name}</p>
      ))}
    </div>
  )
}