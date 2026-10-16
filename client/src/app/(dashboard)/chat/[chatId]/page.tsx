"use client";

import ChatWindow from "@/components/chat/ChatWindow";
import MessageInput from "@/components/chat/MessageInput";
import { useChatRoute } from "@/components/chat/ChatRouteContext";
import { Separator } from "@/components/ui/separator";

export default function ChatConversationPage() {
  const { selectedChat, setIsOpenChat, sendMessage } = useChatRoute();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-hidden">
        <ChatWindow
          selectedChat={selectedChat}
          onClickMobile={() => setIsOpenChat(true)}
        />
      </div>
      {selectedChat && (
        <div className="shrink-0">
          <Separator />
          <MessageInput
            selectedChat={selectedChat}
            onSendMessage={sendMessage}
          />
        </div>
      )}
    </div>
  );
}
