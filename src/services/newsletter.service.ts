/**
 * Newsletter Service
 * 
 * This module provides functionality for managing newsletter subscriptions.
 * 
 * @module services/newsletter
 */

import api from './api';

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
 * Newsletter subscriber interface
 */
export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  confirmed: boolean;
  lastSentAt?: string;
}

/**
 * Newsletter subscription request interface
 */
interface NewsletterSubscriptionRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Newsletter service
 */
class NewsletterService {
  /**
   * Get all newsletter subscribers (requires authentication)
   * @returns List of subscribers
   */
  public async getAllSubscribers(): Promise<NewsletterSubscriber[]> {
    try {
      const response = await api.get<ApiResponse<NewsletterSubscriber[]>>('/newsletter/subscribers');
      return response.data;
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
      throw error;
    }
  }

  /**
   * Subscribe to newsletter (public)
   * @param data Subscription data
   * @returns Created subscriber
   */
  public async subscribe(data: NewsletterSubscriptionRequest): Promise<NewsletterSubscriber> {
    try {
      const response = await api.post<ApiResponse<NewsletterSubscriber>>('/newsletter/subscribe', data);
      return response.data;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from newsletter (public)
   * @param email Email address to unsubscribe
   */
  public async unsubscribe(email: string): Promise<void> {
    try {
      await api.delete(`/newsletter/unsubscribe?email=${email}`);
    } catch (error) {
      console.error(`Error unsubscribing email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Delete a subscriber (requires authentication)
   * @param id Subscriber ID
   */
  public async deleteSubscriber(id: string): Promise<void> {
    try {
      await api.delete(`/newsletter/subscribers/${id}`);
    } catch (error) {
      console.error(`Error deleting subscriber ${id}:`, error);
      throw error;
    }
  }

  /**
   * Send test email (requires authentication)
   * @param email Email address to send test to
   */
  public async sendTestEmail(email: string): Promise<void> {
    try {
      await api.post(`/newsletter/test?email=${email}`);
    } catch (error) {
      console.error(`Error sending test email to ${email}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const newsletterService = new NewsletterService();
export default newsletterService;