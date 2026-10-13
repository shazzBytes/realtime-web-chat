const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type:String,
    unique: true,
    required: true,
  },
  email: {
    type:String,
    required: true,
  },
  password: {
    type:String,
    required: true,
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