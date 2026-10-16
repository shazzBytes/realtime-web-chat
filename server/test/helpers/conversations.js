const Conversation = require("../../src/models/Conversation.model.js");

async function createConversation({ members, createdBy, type = "direct", name }) {
  return Conversation.create({
    type,
    ...(type === "group" ? { name: name ?? "Test group" } : {}),
    members: members.map((user) => ({ userId: user._id })),
    createdBy: createdBy._id,
  });
}

module.exports = { createConversation };
