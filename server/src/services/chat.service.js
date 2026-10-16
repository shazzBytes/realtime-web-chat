const Conversation = require("../models/Conversation.model.js");

async function listUserConversations(userId) {
  return Conversation.find({ "members.userId": userId })
    .populate("members.userId", "username avatar isOnline lastSeen")
    .sort({ updatedAt: -1 })
    .lean();
}

module.exports = {
  listUserConversations,
};
