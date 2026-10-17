const { z } = require("zod");
const { authenticateAccessToken } = require("../middleware/auth.middleware");
const objectIdSchema = z.string().regex(/^[0-9a-fA-f]{24}$/, "invalid User Id");
const { createGroup } = require("../controllers/group.controller");
const { validate } = require("../middleware/validation.middleware");
const router = require("express").Router();

// Create a group conversation
const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Group name is required")
    .max(100, "Group name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  avatar: z.string().trim().optional(),

  memberIds: z
    .array(objectIdSchema)
    .min(1, "A group must have at least one other member")
    .max(99, "A group cannot have more than 99 other members")
    .refine(
      (ids) => new Set(ids.map((id) => id.toLowerCase())).size === ids.length,
      "Duplicate member IDs are not allowed",
    ),
});

router.post("/", authenticateAccessToken, validate(createGroupSchema), createGroup);

module.exports = router;
