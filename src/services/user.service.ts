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
      // Utiliser une méthode spécifique si elle existe
      const response = await api.getUsers(); // Remplacer par api.getUserById(id) si disponible
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
   * @param status New status
   * @returns Updated user
   */
  public async updateUserStatus(
    id: string,
    status: "ACTIVE" | "INACTIVE"
  ): Promise<User> {
    try {
      const response = await api.updateUserStatus(id, status);
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
