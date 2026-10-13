const bcrypt =require("bcrypt");
const User = require("../models/User.model.js");
const { generateToken } = require("../utils/generateToken.js");

module.exports = async function loginUser({ email, password }) {
  const user = await User.findOne({ email });

  if (
    !user ||
    !(await bcrypt.compare(password, user.passwordHash))
  ) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
    },
  };
}