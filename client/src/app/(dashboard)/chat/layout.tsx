"use client";

import { ChatRouteProvider } from "@/components/chat/ChatRouteContext";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { Chat } from "@/components/chat/types";
import { Card } from "@/components/ui/card";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, Suspense, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useChat } from "@/hooks/useChat";

type ChatLayoutProps = {
  children: ReactNode;
};

function ChatLayoutContent({ children }: ChatLayoutProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.isLoading);
  const params = useParams<{ chatId?: string }>();
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const { data: chatData = [], isLoading: isLoadingChats, isError: isChatError } = useChat();

  useEffect(() => {
    let isMounted = true;

    async function validateSession() {
      if (isAuthenticated) {
        return;
      }

      setLoading(true);

      try {
        const response = await authService.getCurrentUser();

        if (isMounted) {
          setUser(response.user);
        }
      } catch {
        if (isMounted) {
          clearAuth();
          router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void validateSession();

    return () => {
      isMounted = false;
    };
  }, [
    clearAuth,
    isAuthenticated,
    router,
    setLoading,
    setUser,
  ]);

  const activeChatId = params.chatId ?? null;
  const activeChat = useMemo(
    () => chatData.find((chat) => chat.id === activeChatId) ?? null,
    [activeChatId, chatData],
  );

  if (isLoading || (!isAuthenticated && !user)) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </div>
    );
  }

  const handleSelectChat = (chat: Chat) => {
    setIsOpenChat(false);
    router.push(`/chat/${chat.id}`);
  };

  return (
    <ChatRouteProvider
      initialChatData={chatData}
      activeChatId={activeChat?.id ?? null}
      onSelectChat={handleSelectChat}
    >
      <Card className="w-full overflow-hidden rounded-none bg-background py-0">
        <div className="flex h-[calc(100vh-4rem)] min-h-0">
          <Sheet open={isOpenChat} onOpenChange={setIsOpenChat}>
            <SheetContent
              side="left"
              showCloseButton={false}
              className="block h-full w-full max-w-80 sm:max-w-80 md:hidden"
            >
              <SheetClose className="absolute top-0 inset-e-0 flex h-9 w-9 items-center justify-center rounded-lg p-2 hover:bg-primary/5 hover:text-primary">
                <X size={20} />
              </SheetClose>
              <ChatSidebar
                chatData={chatData}
                chatSearch={chatSearch}
                setChatSearch={setChatSearch}
                activeChatId={activeChatId}
                onSelectChat={handleSelectChat}
                isLoading={isLoadingChats}
                isError={isChatError}
              />
            </SheetContent>
          </Sheet>

          <aside className="hidden h-full max-w-75 border-e sm:max-w-87.5 md:block">
            <ChatSidebar
              chatData={chatData}
              chatSearch={chatSearch}
              setChatSearch={setChatSearch}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
              isLoading={isLoadingChats}
              isError={isChatError}
            />
          </aside>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </Card>
    </ChatRouteProvider>
  );
}

export default function ChatLayout(props: ChatLayoutProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading chat…</p>
        </div>
      }
    >
      <ChatLayoutContent {...props} />
    </Suspense>
  );
}
