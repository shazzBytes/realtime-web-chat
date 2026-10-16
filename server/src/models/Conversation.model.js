const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },

    name: {
      type: String,
      trim: true,
      maxlength: 100,
      required: function () {
        return this.type === "group";
      },
    },

    avatar: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    members: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },

          role: {
            type: String,
            enum: ["admin", "member"],
            default: "member",
          },

          joinedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      required: true,
      validate: {
        validator: (members) => members.length >= 2,
        message: "A conversation must have at least two members.",
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate membership entries for the same user.
conversationSchema.path("members").validate(function (members) {
  const userIds = members.map((member) => member.userId.toString());
  return new Set(userIds).size === userIds.length;
}, "A user cannot be added to a conversation more than once.");

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
