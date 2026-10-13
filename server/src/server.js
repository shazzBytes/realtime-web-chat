// const { Server } = require('socket.io');
const createApp = require('./app.js');
const connectDB = require('./config/database.js');
require('dotenv').config()
async function main() {
  await connectDB();

  const app = createApp();

  // Socket auth middleware + event handlers will be registered here in Slice 3
  // io.on('connection', (socket) => {
  //   console.log('🔌 Socket connected:', socket.id);
  //   socket.on('disconnect', () => {
  //     console.log('🔌 Socket disconnected:', socket.id);
  //   });
  // });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  });
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});