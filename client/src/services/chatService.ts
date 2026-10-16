import { api } from "./api";
import type { Chat } from "@/components/chat/types";

type ConversationMember = {
  userId: {
    _id: string;
    username: string;
    avatar?: string | null;
    isOnline?: boolean;
    lastSeen?: string | null;
  };
};

type Conversation = {
  _id: string;
  type: "direct" | "group";
  name?: string;
  avatar?: string | null;
  members: ConversationMember[];
  updatedAt: string;
};

type ConversationResponse = {
  conversations: Conversation[];
};

export const chatService = {
  listConversations() {
    return api<ConversationResponse>("/conversations");
  },
};

export function toChat(conversation: Conversation, currentUserId: string): Chat {
  const otherMember = conversation.members.find(
    (member) => member.userId._id !== currentUserId,
  )?.userId;

  return {
    id: conversation._id,
    name: conversation.type === "group"
      ? conversation.name ?? "Unnamed group"
      : otherMember?.username ?? "Conversation",
    status: otherMember?.isOnline ? "online" : "offline",
    thumb: otherMember?.avatar ?? "",
    excerpt: "No messages yet",
    messages: [],
  };
}
