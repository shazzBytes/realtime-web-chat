const express = require("express");
const { listConversations } = require("../controllers/chat.controller.js");
const { authenticate } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/", authenticate, listConversations);

module.exports = router;
