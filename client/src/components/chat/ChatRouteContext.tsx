"use client";

import { Chat } from "@/components/chat/types";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ChatRouteContextValue = {
  chatData: Chat[];
  selectedChat: Chat | null;
  isOpenChat: boolean;
  setIsOpenChat: (open: boolean) => void;
  selectChat: (chat: Chat) => void;
  sendMessage: (chatId: string | number, message: string) => void;
};

const ChatRouteContext = createContext<ChatRouteContextValue | null>(null);

type ChatRouteProviderProps = {
  initialChatData: Chat[];
  activeChatId: string | number | null;
  onSelectChat: (chat: Chat) => void;
  children: ReactNode;
};

export function ChatRouteProvider({
  initialChatData,
  activeChatId,
  onSelectChat,
  children,
}: ChatRouteProviderProps) {
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [chatData, setChatData] = useState(initialChatData);

  const selectedChat =
    chatData.find((chat) => chat.id === activeChatId) ?? null;

  const sendMessage = (chatId: string | number, message: string) => {
    setChatData((previousChats) =>
      previousChats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: chat.messages.length + 1,
                  senderId: 0,
                  msg: message,
                  type: "text",
                  createdAt: new Date(),
                  attachment: [],
                },
              ],
            }
          : chat,
      ),
    );
  };

  const value = useMemo(
    () => ({
      chatData,
      selectedChat,
      isOpenChat,
      setIsOpenChat,
      selectChat: onSelectChat,
      sendMessage,
    }),
    [chatData, selectedChat, isOpenChat, onSelectChat],
  );

  return (
    <ChatRouteContext.Provider value={value}>
      {children}
    </ChatRouteContext.Provider>
  );
}

export function useChatRoute() {
  const context = useContext(ChatRouteContext);

  if (!context) {
    throw new Error("useChatRoute must be used within ChatRouteProvider");
  }

  return context;
}
