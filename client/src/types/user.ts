export interface User {
  _id: String;
  username: String;
  email: String;
  password: String;
  avatar: String;
  bio: String;
  isOnline: Boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date
}