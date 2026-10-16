/**
 * Safe public user profile returned by the API.
 * This type deliberately omits password (never sent by the server).
 * Fields that may be absent for new users are optional.
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  isOnline?: boolean;
  lastSeen?: string | null;
  createdAt?: string;
  updatedAt?: string;
}