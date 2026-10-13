const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
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
    const user = await User.findById(payload.id).select("-passwordHash").lean();

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

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authenticate };
