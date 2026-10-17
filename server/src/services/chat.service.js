const Conversation = require("../models/Conversation.model.js");
const User = require("../models/User.model.js");
const Message = require("../models/Message.model.js")

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Create or retrieve a direct conversation.
const createDirectConversation = async (currentUserId, recipientId) => {
  if (currentUserId.toString() === recipientId.toString()) {
    throw createError("You cannot create a conversation with yourself.", 400);
  }

  const recipientExists = await User.exists({ _id: recipientId });

  if (!recipientExists) {
    throw createError("Recipient not found.", 404);
  }

  const existingConversation = await Conversation.findOne({
    type: "direct",
    "members.userId": {
      $all: [currentUserId, recipientId],
    },
    members: { $size: 2 },
  });

  if (existingConversation) {
    return {
      conversation: existingConversation,
      created: false,
    };
  }

  const conversation = await Conversation.create({
    type: "direct",
    createdBy: currentUserId,
    members: [
      { userId: currentUserId, role: "member" },
      { userId: recipientId, role: "member" },
    ],
  });

  return {
    conversation,
    created: true,
  };
};

// Create a group conversation.
const createGroupConversation = async (
  currentUserId,
  { name, description, avatar, memberIds }
) => {
  const allMemberIds = [
    currentUserId.toString(),
    ...memberIds.map((id) => id.toString()),
  ];

  // Defensive business-rule check.
  if (new Set(allMemberIds).size !== allMemberIds.length) {
    throw createError("Duplicate group members are not allowed.", 400);
  }

  const existingUsers = await User.find({
    _id: { $in: memberIds },
  }).select("_id");

  if (existingUsers.length !== memberIds.length) {
    throw createError("One or more group members do not exist.", 400);
  }

  const members = [
    { userId: currentUserId, role: "admin" },
    ...memberIds.map((userId) => ({
      userId,
      role: "member",
    })),
  ];

  const conversation = await Conversation.create({
    type: "group",
    name,
    description,
    avatar,
    createdBy: currentUserId,
    members,
  });

  return conversation;
};

// List conversations for the authenticated user.
const listUserConversations = async (userId) => {
  return Conversation.find({
    "members.userId": userId,
  })
    .populate("members.userId", "username avatar")
    .populate("lastMessage")
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .lean();
};

module.exports = {
  createDirectConversation,
  createGroupConversation,
  listUserConversations,
};

