const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "file", "system"],
      default: "text",
      required: true,
    },

    content: {
      type: String,
      trim: true,
      maxlength: 10000,
      default: "",
    },

    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
          trim: true,
          maxlength: 255,
        },
        mimeType: {
          type: String,
          trim: true,
        },
        size: {
          type: Number,
          min: 0,
        },
      },
    ],

    editedAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Supports chronological message retrieval.
messageSchema.index({
  conversationId: 1,
  createdAt: -1,
  _id: -1,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
