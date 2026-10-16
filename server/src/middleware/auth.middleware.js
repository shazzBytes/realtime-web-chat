const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

async function authenticateAccessToken(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      if (
        error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError" ||
        error.name === "NotBeforeError"
      ) {
        return res.status(401).json({
          message: "Invalid or expired session",
        });
      }
      throw error;
    }

    if (typeof payload === "string" || typeof payload.id !== "string") {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }
    const user = await User.findById(payload.id).select("-password").lean();

    if (!user) {
      return res.status(401).json({
        message: "user no longer exists",
      });
    }
    if (user.status === "disabled") {
      return res.status(403).json({
        message: "Account is disabled",
      });
    }
    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      avatar: user.avatar ?? null,
      bio: user.bio ?? null,
      isOnline: user.isOnline ?? false,
      lastSeen: user.lastSeen ?? null,
    };
    next();
  } catch (error) {
    next(error);
  }
}

function authenticateRefreshToken(req, res, next) {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({
      message: "Refresh token required",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    if (
      typeof payload === "string" ||
      typeof payload.userId !== "string" ||
      payload.type !== "refresh" ||
      typeof payload.jti !== "string"
    ) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    req.refreshToken = token;
    req.refreshPayload = payload;

    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    next(error);
  }
}

module.exports = {
  authenticate: authenticateAccessToken,
  authenticateAccessToken,
  authenticateRefreshToken,
};
