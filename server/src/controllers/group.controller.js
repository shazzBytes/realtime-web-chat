const chatService = require("../services/chat.service");

const createGroup = async (req, res, next) => {
  try {
    const conversation = await chatService.createGroupConversation(
      req.user.id,
      req.validated.body
    );

    return res.status(201).json({
      message: "Group conversation created successfully.",
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
};
