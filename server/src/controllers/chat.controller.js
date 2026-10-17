const chatService = require("../services/chat.service.js");

async function listConversations(req, res, next) {
  try {
    const conversations = await chatService.listUserConversations(req.user.id);

    return res.status(200).json({ conversations });
  } catch (error) {
    return next(error);
  }
}

async function createConversation(req, res, next) {
  try {
    const { recipientId } = req.body;
    const result = await chatService.createConversation(
      req.user._id,
      recipientId,
    );
    return res.status(result.created ? 201 : 200).json({
      message: result.created
        ? "Direct Conversation created successfully."
        : "Direct Conversation already exists.",
      conversation: result.conversation,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listConversations,
  createConversation,
};
