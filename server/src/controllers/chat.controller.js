const chatService = require("../services/chat.service.js");

async function listConversations(req, res, next) {
  try {
    const conversations = await chatService.listUserConversations(req.user.id);

    return res.status(200).json({ conversations });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listConversations,
};
