const bcrypt =require("bcrypt");
const User = require("../models/User.model.js");
const generateToken = require("../utils/generateToken.js");

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });

  if (
    !user ||
    !(await bcrypt.compare(password, user.password))
  ) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ id: user._id.toString() });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
    },
  };
}

async function registerUser({ username, email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedUsername = email.trim().toLowerCase();
  const existingUser = await User.findOne({email: normalizedEmail});
  
  if (!email || !password || !username) {
    const error = new Error("Email, password, or username is required")
    error.statusCode = 400;
    throw error;
  }
  const existingUsername = await User.findOne({normalizedUsername});

  if (existingUser) {
    const error = new Error("Email already exists, please log in");
    error.statusCode = 409;
    throw error;
  }
  if (existingUsername) {
    const error = new Error("username is taken, try another one");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    username: username.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = generateToken({ id: user._id.toString() });

  return {
    token, 
    user: {
      id: user._id,
      email: user.email,
    },
  };
}

module.exports = {
  loginUser,
  registerUser,
}