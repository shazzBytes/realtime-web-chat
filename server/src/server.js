import http from 'http';
// import { Server } from 'socket.io';
// import { createApp } from './app.js';
import { connectDB } from './config/database.js';
// import { env } from './config/env.js';

async function bootstrap() {
  await connectDB();

  const app = createApp();
  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  // 👉 Socket auth middleware + event handlers will be registered here in Slice 3
//   io.on('connection', (socket) => {
//     console.log('🔌 Socket connected:', socket.id);
//     socket.on('disconnect', () => {
//       console.log('🔌 Socket disconnected:', socket.id);
//     });
//   });

  httpServer.listen(env.port, () => {
    console.log(`🚀 Server running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});