const assert = require("../helpers/assert");
const User = require("../../src/models/User.model.js");
const { cookieHeader } = require("../helpers/http");

async function registerUser(request, username) {
  const email = `${username}@example.com`;

  const response = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password: "password123",
    }),
  });

  assert.equal(response.status, 200);

  const user = await User.findOne({ email });
  assert.ok(user, `User ${username} should exist`);

  return {
    user,
    cookies: cookieHeader(response),
  };
}

module.exports = registerUser;
