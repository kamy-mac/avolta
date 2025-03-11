/**
 * Service API centralisé
 * Gère toutes les requêtes HTTP vers le backend
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Configuration de base
const API_BASE_URL = 'http://localhost:8090/api';

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Intercepteur pour les requêtes
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour les réponses
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Authentification
  public async login(email: string, password: string): Promise<AxiosResponse> {
    return this.api.post('/auth/login', { email, password });
  }

  public async register(userData: any): Promise<AxiosResponse> {
    return this.api.post('/auth/register', userData);
  }

  // Publications
  public async getPublications(): Promise<AxiosResponse> {
    return this.api.get('/publications');
  }

  public async getPublicationById(id: string): Promise<AxiosResponse> {
    return this.api.get(`/publications/${id}`);
  }

  public async createPublication(data: any): Promise<AxiosResponse> {
    return this.api.post('/publications', data);
  }

  public async updatePublication(id: string, data: any): Promise<AxiosResponse> {
    return this.api.put(`/publications/${id}`, data);
  }

  public async deletePublication(id: string): Promise<AxiosResponse> {
    return this.api.delete(`/publications/${id}`);
  }

  public async approvePublication(id: string): Promise<AxiosResponse> {
    return this.api.put(`/publications/${id}/approve`);
  }

  public async rejectPublication(id: string): Promise<AxiosResponse> {
    return this.api.put(`/publications/${id}/reject`);
  }

  // Commentaires
  public async getComments(publicationId: string): Promise<AxiosResponse> {
    return this.api.get(`/publications/${publicationId}/comments`);
  }

  public async addComment(publicationId: string, data: any): Promise<AxiosResponse> {
    return this.api.post(`/publications/${publicationId}/comments`, data);
  }

  public async deleteComment(publicationId: string, commentId: string): Promise<AxiosResponse> {
    return this.api.delete(`/publications/${publicationId}/comments/${commentId}`);
  }

  // Newsletter
  public async getSubscribers(): Promise<AxiosResponse> {
    return this.api.get('/newsletter/subscribers');
  }

  public async subscribe(data: any): Promise<AxiosResponse> {
    return this.api.post('/newsletter/subscribe', data);
  }

  public async unsubscribe(email: string): Promise<AxiosResponse> {
    return this.api.delete(`/newsletter/unsubscribe/${email}`);
  }

  // Utilisateurs
  public async getUsers(): Promise<AxiosResponse> {
    return this.api.get('/users');
  }

  public async updateUser(id: string, data: any): Promise<AxiosResponse> {
    return this.api.put(`/users/${id}`, data);
  }

  public async deleteUser(id: string): Promise<AxiosResponse> {
    return this.api.delete(`/users/${id}`);
  }
}

export default ApiService.getInstance();