const http = require("node:http");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { createRequest } = require("./http");

process.env.JWT_ACCESS_SECRET = "test-access-secret";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
process.env.FRONTEND_URL = "http://127.0.0.1:3000";

const createApp = require("../../src/app.js");

async function startTestApp() {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const server = http.createServer(createApp());
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  const { port } = server.address();

  return {
    request: createRequest(`http://127.0.0.1:${port}`),
    async resetDatabase() {
      await Promise.all(
        Object.values(mongoose.connection.collections).map((collection) =>
          collection.deleteMany({}),
        ),
      );
    },
    async close() {
      await new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
      await mongoose.disconnect();
      await mongoServer.stop();
    },
  };
}

module.exports = { startTestApp };
