import { makeAutoObservable, action } from 'mobx';
import { User } from '../shared/schemas';
import { authApi } from '../api/authApi';
import { RootStore } from './rootStore';

export class AuthStore {
  user: User | null = null;
  status: 'idle' | 'loading' | 'error' = 'idle';
  error: string | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  /**
   * Login with email and password
   */
  login = action(async (email: string, password: string) => {
    try {
      this.status = 'loading';
      this.error = null;
      
      const response = await authApi.login(email, password);
      this.user = response.user;
      this.status = 'idle';
      
      this.rootStore.ui.showToast('success', 'Welcome back!', 'Successfully logged in');
    } catch (error: any) {
      this.status = 'error';
      this.error = error.response?.data?.error?.message || 'Login failed';
      this.rootStore.ui.showToast('error', 'Login failed', this.error || 'Login failed');
      throw error;
    }
  });

  /**
   * Sign up new user
   */
  signup = action(async (name: string, email: string, password: string) => {
    try {
      this.status = 'loading';
      this.error = null;
      
      const response = await authApi.signup(name, email, password);
      this.user = response.user;
      this.status = 'idle';
      
      this.rootStore.ui.showToast('success', 'Welcome!', 'Account created successfully');
    } catch (error: any) {
      this.status = 'error';
      this.error = error.response?.data?.error?.message || 'Signup failed';
      this.rootStore.ui.showToast('error', 'Signup failed', this.error || 'Signup failed');
      throw error;
    }
  });

  /**
   * Check if user has valid session
   */
  checkSession = action(async () => {
    try {
      this.status = 'loading';
      this.error = null;
      
      const response = await authApi.checkSession();
      this.user = response.user;
      this.status = 'idle';
    } catch (error: any) {
      this.status = 'idle'; // Not an error state for invalid sessions
      this.user = null;
    }
  });

  /**
   * Logout current user
   */
  logout = action(async () => {
    try {
      await authApi.logout();
      this.user = null;
      this.status = 'idle';
      this.error = null;
      
      this.rootStore.ui.showToast('success', 'Goodbye!', 'Successfully logged out');
    } catch (error: any) {
      // Still clear local state even if API call fails
      this.user = null;
      this.status = 'idle';
      this.error = null;
    }
  });

  get isAuthenticated() {
    return !!this.user;
  }

  get isLoading() {
    return this.status === 'loading';
  }
}