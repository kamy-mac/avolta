/**
 * Publication Service
 *
 * This module provides functionality for managing publications including
 * creating, updating, deleting, and retrieving publications.
 *
 * @module services/publication
 */

import api from "./api";
import { Post } from "../types";

/**
 * Create publication request interface
 */
interface CreatePublicationRequest {
  title: string;
  content: string;
  imageUrl: string;
  validFrom: string;
  validTo: string;
  category: string;
  sendNewsletter?: boolean;
}

/**
 * Update publication request interface
 */
interface UpdatePublicationRequest {
  title?: string;
  content?: string;
  imageUrl?: string;
  validFrom?: string;
  validTo?: string;
  category?: string;
}

/**
 * Publication service
 */
class PublicationService {
  /**
   * Get all publications (requires authentication)
   * @returns List of all publications
   */
  public async getAllPublications(): Promise<Post[]> {
    try {
      const response = await api.getPublications();
      return response.data.data;
    } catch (error) {
      console.error("Error fetching publications:", error);
      throw error;
    }
  }

  /**
   * Get active publications (public)
   * @returns List of active publications
   */
  public async getActivePublications(): Promise<Post[]> {
    try {
      // Utilisez la méthode spécifique si elle existe dans votre API
      const response = await api.getPublicPublications(); // ou api.getActivePublications()
      return response.data.data;
    } catch (error) {
      console.error("Error fetching active publications:", error);
      throw error;
    }
  }

  /**
   * Get active publications by category (public)
   * @param category Publication category
   * @returns List of active publications in the specified category
   */
  public async getActivePublicationsByCategory(
    category: string
  ): Promise<Post[]> {
    try {
      // Utilisez la méthode spécifique si elle existe dans votre API
      const response = await api.getPublicationsByCategory(category);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching publications by category:", error);
      throw error;
    }
  }

  /**
   * Get pending publications (super admin only)
   * @returns List of pending publications
   */
  public async getPendingPublications(): Promise<Post[]> {
    try {
      const response = await api.getPublications(); // Remplacez par la méthode spécifique
      return response.data.data.filter(
        (pub: Post) => pub.status.toLowerCase() === "pending"
      );
    } catch (error) {
      console.error("Error fetching pending publications:", error);
      throw error;
    }
  }

  /**
   * Get publication by ID (public for published publications)
   * @param id Publication ID
   * @returns Publication details
   */
  public async getPublicationById(id: string): Promise<Post> {
    try {
      const response = await api.getPublicationById(id);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching publication with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new publication (requires authentication)
   * @param publicationData Publication data
   * @returns Created publication
   */
  public async createPublication(
    publicationData: CreatePublicationRequest
  ): Promise<Post> {
    try {
      const response = await api.createPublication(publicationData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating publication:", error);
      throw error;
    }
  }

  /**
   * Update a publication (requires authentication)
   * @param id Publication ID
   * @param publicationData Updated publication data
   * @returns Updated publication
   */
  public async updatePublication(
    id: string,
    publicationData: UpdatePublicationRequest
  ): Promise<Post> {
    try {
      const response = await api.updatePublication(id, publicationData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating publication with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Approve a publication (super admin only)
   * @param id Publication ID
   * @returns Approved publication
   */
  public async approvePublication(id: string): Promise<Post> {
    try {
      const response = await api.approvePublication(id);
      return response.data.data;
    } catch (error) {
      console.error(`Error approving publication with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Reject a publication (super admin only)
   * @param id Publication ID
   */
  public async rejectPublication(id: string): Promise<void> {
    try {
      await api.rejectPublication(id);
    } catch (error) {
      console.error(`Error rejecting publication with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a publication (requires authentication)
   * @param id Publication ID
   */
  public async deletePublication(id: string): Promise<void> {
    try {
      await api.deletePublication(id);
    } catch (error) {
      console.error(`Error deleting publication with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Like a publication (public)
   * @param id Publication ID
   * @returns Updated publication with incremented likes
   */
  public async likePublication(id: string): Promise<Post> {
    try {
      // Si vous avez une méthode likePublication dans votre API, utilisez-la
      const response = await api.likePublication(id);
      return response.data.data;
    } catch (error) {
      console.error(`Error liking publication with ID ${id}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const publicationService = new PublicationService();
export default publicationService;
