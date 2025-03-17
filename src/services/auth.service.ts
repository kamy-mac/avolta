/**
 * Authentication Service
 *
 * This module provides authentication-related functionality including login, logout,
 * and user management.
 *
 * @module services/auth
 */

import api from "./api";
import { User } from "../types";

/**
 * Login request interface
 */
interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response interface
 */
interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Register request interface
 */
interface RegisterRequest {
  email: string;
  password: string;
  role?: string;
}

/**
 * Authentication service
 */
class AuthService {
  /**
   * Login user
   * @param credentials User credentials
   * @returns Login response with token and user info
   */
  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log("Tentative de connexion avec:", credentials);
      const response = await api.login(credentials.email, credentials.password);
      console.log("Réponse complète:", response);

      // Correction: accès au bon chemin dans la structure de réponse
      // La structure est: { success, message, data: { token, user }, timestamp }
      const { token, user } = response.data.data;

      // Store token
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      return { token, user };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  public logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  }

  /**
   * Register new user (admin only)
   * @param userData User registration data
   * @returns Created user
   */
  public async register(userData: RegisterRequest): Promise<User> {
    try {
      const response = await api.register(userData);
      return response.data.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  /**
   * Get current user information
   * @returns User information or null if not authenticated
   */
  public getCurrentUser(): User | null {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  /**
   * Check if user has a specific role
   */
  public hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role.toLowerCase();
  }

  /**
   * Check if user is a super admin
   */
  public isSuperAdmin(): boolean {
    return this.hasRole("superadmin");
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
