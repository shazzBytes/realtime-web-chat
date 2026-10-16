const User = require("../models/User.model");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Search users by username, excluding the authenticated user.
async function searchUser(username, currentUserId) {
  const query = escapeRegex(username);

  return User.find({
    username: {
      $regex: query,
      $options: "i",
    },
    _id: { $ne: currentUserId },
  })
    .select("username avatar")
    .limit(10)
    .lean();
}

// Retrieve a list of public user profiles.
async function getUsers(currentUserId) {
  return User.find({
    _id: { $ne: currentUserId },
  })
    .select("username avatar")
    .sort({ username: 1, _id: 1 })
    .limit(20)
    .lean();
}

// Retrieve one user's public profile.
async function getUserById(userId) {
  return User.findById(userId).select("username avatar bio").lean();
}

// Update explicitly permitted profile fields.
async function updateProfile(currentUserId, profileData) {
  const updates = {};

  if (profileData.username !== undefined) {
    updates.username = profileData.username;
  }

  if (profileData.bio !== undefined) {
    updates.bio = profileData.bio;
  }

  return User.findByIdAndUpdate(
    currentUserId,
    { $set: updates },
    {
      returnDocument: "after",
      runValidators: true,
    },
  )
    .select("username avatar bio")
    .lean();
}

// Update the authenticated user's avatar URL.
async function updateAvatar(currentUserId, avatar) {
  return User.findByIdAndUpdate(
    currentUserId,
    { $set: { avatar } },
    {
      returnDocument: "after",
      runValidators: true,
    },
  )
    .select("username avatar bio")
    .lean();
}

module.exports = {
  searchUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
};
