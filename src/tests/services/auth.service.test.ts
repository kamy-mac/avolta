/**
 * Tests for auth service
 */

import authService from '../../services/auth.service';
import api from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login should call API and set token', async () => {
    // Mock API response
    const mockResponse = {
      token: 'test-token',
      user: {
        id: '1',
        email: 'test@example.com',
        role: 'admin',
        createdAt: new Date(),
        status: 'active'
      }
    };
    
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    // Call login
    const result = await authService.login({
      email: 'test@example.com',
      password: 'password123'
    });

    // Check if API was called correctly
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });

    // Check if token was set
    expect(api.setToken).toHaveBeenCalledWith('test-token');

    // Check if result is correct
    expect(result).toEqual(mockResponse);
  });

  test('logout should clear token and redirect', () => {
    // Mock window.location
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, href: '' };

    // Call logout
    authService.logout();

    //
  }
  )
}
)