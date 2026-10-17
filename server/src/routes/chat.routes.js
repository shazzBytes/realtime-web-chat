const express = require("express");
const { z } = require("zod");

const {
  listConversations,
  createConversation,
} = require("../controllers/chat.controller.js");
const { authenticate } = require("../middleware/auth.middleware.js");
const { validate } = require("../middleware/validation.middleware.js");
const router = express.Router();

const objectIdSchema = z.string().regex(/^[0-9a-fA-f]{24}$/, "invalid User Id");

const createConversationSchema = z.object({
  body: z.object({
    recipientId: objectIdSchema,
  }),
});

router.get("/", authenticate, listConversations);
router.post(
  "/",
  authenticate,
  validate(createConversationSchema),
  createConversation,
);
module.exports = router;
