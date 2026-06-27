import { apiPost, apiGet } from "./api-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { LoginResponse, User } from "@/types/user";

export interface LoginCredentials {
  email: string;
  password?: string; // Optional if you support magic links or other methods, but usually required
}

export const authService = {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiPost<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, credentials);
  },

  /**
   * Fetch current authenticated user's profile
   */
  async me(): Promise<User> {
    return apiGet<User>(API_ENDPOINTS.AUTH_ME);
  },

  /**
   * Logout user and invalidate tokens on server
   */
  async logout(): Promise<void> {
    return apiPost<void>(API_ENDPOINTS.AUTH_LOGOUT);
  },
};
