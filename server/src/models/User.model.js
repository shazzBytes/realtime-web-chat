const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type:String,
  },
  email: {
    type:String
  },
  password: {
    type:String
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