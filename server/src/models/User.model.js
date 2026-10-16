const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type:String,
    unique: true,
    required: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address'],
  },
  password: {
    type:String,
    required: true,
    minLength: [8, 'Username must be at least 3 characters long, got {VALUE}'],
  },
  avatar: {
    type:String
  },
  bio: {
    type:String
  },
  isOnline: {
    type:Boolean
  },
  lastSeen: {
    type:Date
  }
  
},{
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema);
module.exports = User;