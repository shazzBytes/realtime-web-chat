const mongoose = require('mongoose');

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  mongoose.set('strictQuery', true);

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  await mongoose.connect(MONGODB_URI);

  console.log('✅ MongoDB connected');
}

module.exports = connectDB;