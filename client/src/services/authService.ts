import { api } from "./api";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "@/types/auth";

export const authService = {
  login(credentials: LoginCredentials) {
    return api<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
  register(credentials: RegisterCredentials) {
    return api<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
  logout() {
    return api<AuthResponse>("/auth/logout", {
      method: "POST",
    });
  },
  getCurrentUser() {
    return api<AuthResponse>("/auth/me", {
      method: "GET",
    });
  },
};
