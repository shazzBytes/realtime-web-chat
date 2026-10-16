const bcrypt = require("bcrypt");
const User = require("../models/User.model.js");
const generateToken = require("../utils/generateToken.js");
const crypto = require("node:crypto");
const RefreshSession = require("../models/RefreshSession.model.js");
const jwt = require("jsonwebtoken");

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

async function createRefreshSession(userId) {
  const jti = crypto.randomUUID();
  const refreshToken = jwt.sign(
    {
      userId: userId.toString(),
      type: "refresh",
      jti,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  await RefreshSession.create({
    userId,
    jti,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  return refreshToken;
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateToken({ id: user._id.toString() });
  const refreshToken = await createRefreshSession(user._id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  };
}

async function registerUser({ username, email, password }) {
  // Presence guard runs first — Zod middleware already checked this, but the
  // service stays defensive in case it is called outside the HTTP route.
  if (!email || !password || !username) {
    const error = new Error("Email, password, and username are required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  const [existingUser, existingUsername] = await Promise.all([
    User.findOne({ email: normalizedEmail }),
    User.findOne({ username: normalizedUsername }),
  ]);

  if (existingUser) {
    const error = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }
  if (existingUsername) {
    const error = new Error("Username is taken, try another one");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    username: username.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const accessToken = generateToken({ id: user._id.toString() });
  const refreshToken = await createRefreshSession(user._id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  };
}

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function createAuthError(message, status = 401) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

async function revokeRefreshSession(refreshToken) {
  if (!refreshToken) {
    return false;
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
      ignoreExpiration: true,
    });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return false;
    }
    throw error;
  }

  if (
    typeof payload === "string" ||
    typeof payload.userId !== "string" ||
    payload.type !== "refresh" ||
    typeof payload.jti !== "string"
  ) {
    return false;
  }

  const result = await RefreshSession.updateOne(
    {
      userId: payload.userId,
      jti: payload.jti,
      tokenHash: hashToken(refreshToken),
      revokedAt: null,
    },
    { $set: { revokedAt: new Date() } },
  );

  return result.modifiedCount === 1;
}

async function refreshSession({ refreshToken, payload }) {
  const { userId, jti, type } = payload;

  if (type !== "refresh" || !userId || !jti) {
    throw createAuthError("Invalid refresh token");
  }

  // Validate the session and match the token hash.
  const session = await RefreshSession.findOne({
    userId,
    jti,
    tokenHash: hashToken(refreshToken),
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    throw createAuthError("Invalid or expired refresh session");
  }

  // Confirm the user still exists and is enabled.
  const user = await User.findById(userId).select("_id status");

  if (!user || user.status === "disabled") {
    throw createAuthError("User unavailable");
  }

  // Generate replacement credentials.
  const newJti = crypto.randomUUID();

  const accessToken = generateToken({
    id: user._id.toString(),
  });

  const newRefreshToken = jwt.sign(
    {
      userId: user._id.toString(),
      type: "refresh",
      jti: newJti,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  // Consume the old session only if it is still valid.
  const updated = await RefreshSession.findOneAndUpdate(
    {
      _id: session._id,
      tokenHash: hashToken(refreshToken),
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    },
    { $set: { revokedAt: new Date() } },
    { new: true }
  );

  if (!updated) {
    throw createAuthError("Refresh token already used");
  }

  await RefreshSession.create({
    userId: user._id,
    jti: newJti,
    tokenHash: hashToken(newRefreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    revokedAt: null,
  });

  return { accessToken, refreshToken: newRefreshToken };
}

module.exports = {
  loginUser,
  registerUser,
  revokeRefreshSession,
  refreshSession,
};
