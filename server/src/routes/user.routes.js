const express = require("express");
const { z } = require("zod");
const { authenticate } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  searchUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require("../controllers/user.controller");

const router = express.Router();
const searchQuerySchema = z.object({ q: z.string().trim().min(1).max(50) });
const userIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID"),
});
const profileSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9_.]+$/)
      .optional(),
    bio: z.string().trim().max(500).optional(),
  })
  .refine((data) => data.username !== undefined || data.bio !== undefined, {
    message: "Provide at least one profile field",
  });
const avatarSchema = z.object({ avatar: z.string().url() });

router.get(
  "/search",
  authenticate,
  validate(searchQuerySchema, "query"),
  searchUser,
);
router.get("/", authenticate, getUsers);
router.get(
  "/:id",
  authenticate,
  validate(userIdParamsSchema, "params"),
  getUserById,
);
router.patch("/profile", authenticate, validate(profileSchema), updateProfile);
router.patch("/avatar", authenticate, validate(avatarSchema), updateAvatar);

module.exports = router;
