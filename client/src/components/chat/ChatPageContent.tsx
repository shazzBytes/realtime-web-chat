"use client";

import ChatWindow from "@/components/chat/ChatWindow";
import { useChatRoute } from "@/components/chat/ChatRouteContext";

export default function ChatPageContent() {
  const { selectedChat, setIsOpenChat } = useChatRoute();

  return (
    <ChatWindow
      selectedChat={selectedChat}
      onClickMobile={() => setIsOpenChat(true)}
    />
  );
}
