const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth.routes");
const chatRouter = require("./routes/chat.routes");
const userRouter = require('./routes/user.routes');
const groupRouter = require('./routes/group.routes')
const errorHandler = require("./middleware/error.middleware");
const logger = require("./middleware/logger.middleware");
const cookieParser = require("cookie-parser")

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
  app.use((cookieParser()))
  app.use("/auth", authRouter);
  app.use("/users",userRouter);
  app.use("/conversations", chatRouter);
  app.use('/groups',groupRouter);
  app.use(errorHandler);
  return app;
}

module.exports = createApp;
