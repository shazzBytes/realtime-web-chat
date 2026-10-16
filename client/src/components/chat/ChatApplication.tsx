"use client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import ChatListing from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import MessageInput from "@/components/chat/MessageInput";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { chatData as initialChatData } from "@/components/chat/mockData";
import {
  Chat,
  CURRENT_USER_ID,
} from "@/components/chat/types";

const ChatApplication = () => {
  const [isOpenChat, setIsOpenChat] = useState(false);

  const [chatData, setChatData] = useState<Chat[]>(initialChatData);
  const [chatSearch, setChatSearch] = useState("");
  const [activeChatId, setActiveChatId] = useState<string | number | null>(null);

  const selectedChat =
    chatData.find((chat) => chat.id === activeChatId) ?? null;

  const handleSelectChat = (chat: Chat) => {
    setActiveChatId(chat.id);
    setIsOpenChat(false);
  };

  const handleSendMessage = (chatId: string | number, message: string) => {
    setChatData((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: chat.messages.length + 1,
                  senderId: CURRENT_USER_ID,
                  msg: message,
                  type: "text" as const,
                  createdAt: new Date(),
                  attachment: [],
                },
              ],
            }
          : chat,
      ),
    );
  };

  return (
    <Card className="py-0 bg-background overflow-hidden w-full rounded-none">
      <div className="flex h-screen">
        {/* ------------------------------------------- */}
        {/* Left Part */}
        {/* ------------------------------------------- */}
        <Sheet
          open={isOpenChat}
          onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) =>
            setIsOpenChat(open)
          }
        >
          <SheetContent
            side="left"
            showCloseButton={false}
            className="max-w-80 sm:max-w-80 w-full h-full lg:z-0 lg:hidden block"
          >
            <SheetClose className="absolute top-0 inset-e-0 p-2 h-9 w-9 flex justify-center items-center hover:bg-primary/5 hover:text-primary cursor-pointer bg-transparent y rounded-lg">
              <X size={20} />
            </SheetClose>

            <ChatListing
              chatData={chatData}
              chatSearch={chatSearch}
              setChatSearch={setChatSearch}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
            />
          </SheetContent>
        </Sheet>
        <div className="max-w-75 sm:max-w-87.5 h-full lg:block hidden border-e">
          <ChatListing
            chatData={chatData}
            chatSearch={chatSearch}
            setChatSearch={setChatSearch}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
          />
        </div>
        {/* ------------------------------------------- */}
        {/* Right part */}
        {/* ------------------------------------------- */}
        <div className="grow w-[70%] min-w-0 flex flex-col h-full">
          <div className="flex-1 min-h-0 overflow-hidden">
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
                onSendMessage={handleSendMessage}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChatApplication;
