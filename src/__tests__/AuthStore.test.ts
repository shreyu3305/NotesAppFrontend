import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthStore } from '../stores/AuthStore';
import { RootStore } from '../stores/rootStore';
import { authApi } from '../api/authApi';

vi.mock('../api/authApi');

describe('AuthStore', () => {
  let authStore: AuthStore;
  let rootStore: RootStore;

  beforeEach(() => {
    rootStore = new RootStore();
    authStore = rootStore.auth;
    vi.clearAllMocks();
  });

  it('should initialize with null user', () => {
    expect(authStore.user).toBeNull();
    expect(authStore.status).toBe('idle');
    expect(authStore.isAuthenticated).toBe(false);
  });

  it('should handle successful login', async () => {
    const mockUser = { _id: '1', email: 'test@example.com', name: 'Test User' };
    const mockResponse = { user: mockUser, token: 'mock-token' };

    vi.mocked(authApi.login).mockResolvedValue(mockResponse);

    await authStore.login('test@example.com', 'password');

    expect(authStore.user).toEqual(mockUser);
    expect(authStore.status).toBe('idle');
    expect(authStore.isAuthenticated).toBe(true);
  });

  it('should handle login failure', async () => {
    const mockError = {
      response: {
        data: {
          error: {
            message: 'Invalid credentials'
          }
        }
      }
    };

    vi.mocked(authApi.login).mockRejectedValue(mockError);

    await expect(authStore.login('test@example.com', 'wrong-password'))
      .rejects.toEqual(mockError);

    expect(authStore.user).toBeNull();
    expect(authStore.status).toBe('error');
    expect(authStore.error).toBe('Invalid credentials');
  });

  it('should clear user on logout', async () => {
    // First login
    const mockUser = { _id: '1', email: 'test@example.com', name: 'Test User' };
    authStore.user = mockUser;

    vi.mocked(authApi.logout).mockResolvedValue();

    await authStore.logout();

    expect(authStore.user).toBeNull();
    expect(authStore.status).toBe('idle');
    expect(authStore.isAuthenticated).toBe(false);
  });
});