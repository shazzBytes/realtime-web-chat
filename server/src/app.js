const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth.routes");
const errorHandler = require("./middleware/error.middleware");
const logger = require("./middleware/logger.middleware");

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }),
  );
  app.use(logger);
  app.use("/auth", authRouter);
  app.use(errorHandler);
  return app;
}

module.exports = createApp;
