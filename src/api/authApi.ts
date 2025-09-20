import { api } from './http';
import { User, ApiError } from '../shared/schemas';

// Mock user data
const mockUser: User = {
  _id: 'user1',
  email: 'demo@example.com',
  name: 'Demo User',
};

const mockToken = 'mock-jwt-token-12345';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(300);
    
    // Mock validation
    if (email === 'demo@example.com' && password === 'password123') {
      localStorage.setItem('auth_token', mockToken);
      return { user: mockUser, token: mockToken };
    }
    
    throw {
      response: {
        data: {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          }
        }
      }
    };
  },

  async signup(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(400);
    
    // Mock user creation
    const newUser: User = {
      _id: 'user_' + Date.now(),
      email,
      name,
    };
    
    localStorage.setItem('auth_token', mockToken);
    return { user: newUser, token: mockToken };
  },

  async checkSession(): Promise<{ user: User }> {
    await delay(200);
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw {
        response: {
          data: {
            error: {
              code: 'NO_SESSION',
              message: 'No valid session found',
            }
          }
        }
      };
    }
    
    return { user: mockUser };
  },

  async logout(): Promise<void> {
    await delay(100);
    localStorage.removeItem('auth_token');
  },
};