/**
 * User Service
 * 
 * This module provides functionality for managing users.
 * 
 * @module services/user
 */

import api from './api';
import { User } from '../types';

/**
 * API response wrapper interface
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

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
      const response = await api.get<ApiResponse<User[]>>('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
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
      const response = await api.get<ApiResponse<User>>(`/users/${id}`);
      return response.data;
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
  public async updateUserStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${id}/status?status=${status}`);
      return response.data;
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
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const userService = new UserService();
export default userService;