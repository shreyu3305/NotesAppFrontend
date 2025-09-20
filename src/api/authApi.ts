import { api } from './http';
import { User, AuthResponse } from '../shared/schemas';

export const authApi = {
  async login(email: string, password: string): Promise<{ user: User; accessToken: string }> {
    const response: AuthResponse = await api.post('/auth/login', { email, password });
    
    // Store access token in localStorage
    localStorage.setItem('auth_token', response.accessToken);
    
    return {
      user: response.user,
      accessToken: response.accessToken
    };
  },

  async signup(name: string, email: string, password: string): Promise<{ user: User; accessToken: string }> {
    const response: AuthResponse = await api.post('/auth/signup', { name, email, password });
    
    // Store access token in localStorage
    localStorage.setItem('auth_token', response.accessToken);
    
    return {
      user: response.user,
      accessToken: response.accessToken
    };
  },

  async checkSession(): Promise<{ user: User }> {
    const response = await api.get('/auth/me');
    return { user: response.user };
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token');
    }
  },

  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await api.post('/auth/refresh');
    
    // Update stored access token
    localStorage.setItem('auth_token', response.accessToken);
    
    return { accessToken: response.accessToken };
  },
};