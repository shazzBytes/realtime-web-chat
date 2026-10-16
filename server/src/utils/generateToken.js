const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");

function generateToken(payload, options = {}) {
  const { secret = process.env.JWT_ACCESS_SECRET, expiresIn = "1h" } = options;
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = generateToken;
