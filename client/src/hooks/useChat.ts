"use client";

import { useQuery } from "@tanstack/react-query";
import { chatService, toChat } from "@/services/chatService";
import { useAuthStore } from "@/store/authStore";

export function useChat() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("user is not authenticated")
      }

      const response = await chatService.listConversations();
      return response.conversations.map((conversation) =>
        toChat(conversation, user!.id),
      );
    },
    enabled: Boolean(user?.id),
  });
}
