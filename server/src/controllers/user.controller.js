const userService = require("../services/user.service");

async function searchUser(req, res) {
  const users = await userService.searchUser(req.validated.query.q, req.user.id);
  return res.status(200).json({ message: "Users retrieved successfully", users });
}

async function getUsers(req, res) {
  const users = await userService.getUsers(req.user.id);
  return res.status(200).json({ message: "Users retrieved successfully", users });
}

async function getUserById(req, res) {
  const user = await userService.getUserById(req.validated.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.status(200).json({ message: "User retrieved successfully", user });
}

async function updateProfile(req, res) {
  const user = await userService.updateProfile(req.user.id, req.validated.body);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.status(200).json({ message: "Profile updated successfully", user });
}

async function updateAvatar(req, res) {
  const user = await userService.updateAvatar(req.user.id, req.validated.body.avatar);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.status(200).json({ message: "Avatar updated successfully", user });
}

module.exports = { searchUser, getUsers, getUserById, updateProfile, updateAvatar };
