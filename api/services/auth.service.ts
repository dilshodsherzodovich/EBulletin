import api from "../axios";
import { LoginCredentials, LoginResponse, UserData } from "../types/auth";

export const authService = {
  /**
   * Login user with username and password
   * @param credentials - Login credentials
   * @returns Promise with login response
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>(
        "/user/login/",
        credentials
      );
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Logout user (clear token from localStorage)
   */
  logout: (): void => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("auth_expiry");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      return false;
    }

    // Check if token is expired (if expiry exists)
    const expiry = localStorage.getItem("auth_expiry");
    if (expiry) {
      const expiryDate = new Date(expiry);
      const now = new Date();
      const isExpired = expiryDate <= now;

      if (isExpired) {
        // Clear expired data
        authService.logout();
        return false;
      }
    }

    return true;
  },

  /**
   * Get stored access token
   */
  getToken: (): string | null => {
    return localStorage.getItem("auth_token");
  },

  /**
   * Get stored refresh token
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem("refresh_token");
  },

  /**
   * Get stored user data
   */
  getUser: (): UserData | null => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  },

  /**
   * Store auth tokens and user data
   */
  storeAuth: (
    accessToken: string,
    refreshToken: string,
    user: UserData,
    expiryDate?: string
  ): void => {
    localStorage.setItem("auth_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    if (expiryDate) {
      localStorage.setItem("auth_expiry", expiryDate);
    }
  },

  /**
   * Store auth token and expiry
   */
  storeToken: (token: string, expiryDate: string): void => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_expiry", expiryDate);
  },

  /**
   * Decode JWT token to get expiry date
   */
  getTokenExpiry: (token: string): Date | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return new Date(payload.exp * 1000); // Convert from seconds to milliseconds
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },
};
