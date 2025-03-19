/**
 * User Service
 *
 * This module provides functionality for managing users.
 *
 * @module services/user
 */

import api from "./api";
import { User } from "../types";

/**
 * Type pour le statut de l'utilisateur
 */
type UserStatus = "active" | "inactive";

/**
 * User service
 */
class UserService {
  /**
   * Get all users (super admin only)
   * @returns List of users
   */
  public async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.getUsers();
      
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response format from server");
      }
      
      return response.data.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  /**
   * Get user by ID (super admin only)
   * @param id User ID
   * @returns User details
   */
  public async getUserById(id: string): Promise<User> {
    try {
      if (!id) throw new Error("User ID is required");
      
      // Idéalement, utiliser une API dédiée pour obtenir un utilisateur par ID
      // Mais si celle-ci n'existe pas, utiliser cette approche
      const response = await api.getUsers();
      
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response format from server");
      }
      
      const user = response.data.data.find((u: User) => u.id === id);
      
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      return user;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update user status (super admin only)
   * @param id User ID
   * @param status New status ("active" or "inactive")
   * @returns Updated user
   */
  public async updateUserStatus(
    id: string,
    status: UserStatus
  ): Promise<User> {
    try {
      if (!id) throw new Error("User ID is required");
      
      // Normaliser le statut pour s'assurer qu'il est en majuscule comme attendu par l'API
      const normalizedStatus = status.toUpperCase() as "ACTIVE" | "INACTIVE";
      
      const response = await api.updateUserStatus(id, normalizedStatus);
      
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response format from server");
      }
      
      return response.data.data;
    } catch (error) {
      console.error(`Error updating status for user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete user (super admin only)
   * @param id User ID
   */
  public async deleteUser(id: string): Promise<void> {
    try {
      if (!id) throw new Error("User ID is required");
      
      await api.deleteUser(id);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const userService = new UserService();
export default userService;