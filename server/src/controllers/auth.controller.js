const authService = require('../services/auth.service.js');

async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}

async function register(req, res, next) {
  try {
    const result = await authService.registerUser(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      "path":"/",
    });

    res.status(200).json({
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  register
};