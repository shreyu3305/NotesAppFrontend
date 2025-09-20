// HTTP client using native fetch API
const API_BASE_URL = 'https://notesappbackend-zgkl.onrender.com/api/v1';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to handle API responses
const handleResponse = async (response: Response, originalRequest?: RequestInit) => {
  if (!response.ok) {
    // Handle 401 errors by attempting token refresh
    if (response.status === 401 && !response.url.includes('/auth/refresh')) {
      try {
        await refreshToken();
        // Retry the original request with new token
        const retryResponse = await fetch(response.url, {
          ...originalRequest,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
            ...originalRequest?.headers,
          },
          credentials: 'include',
        });
        return handleResponse(retryResponse, originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        throw {
          response: {
            data: { error: { code: 'AUTH_EXPIRED', message: 'Session expired' } },
            status: 401,
            statusText: 'Unauthorized'
          }
        };
      }
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw {
      response: {
        data: errorData,
        status: response.status,
        statusText: response.statusText
      }
    };
  }
  return response.json();
};

// Helper function to refresh token
const refreshToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Token refresh failed');
  }
  
  const data = await response.json();
  localStorage.setItem('auth_token', data.accessToken);
  return data.accessToken;
};

// HTTP client with fetch
export const api = {
  async get(url: string, options: RequestInit = {}) {
    const token = getAuthToken();
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include', // For refresh token cookies
      ...options,
    };
    const response = await fetch(`${API_BASE_URL}${url}`, requestOptions);
    return handleResponse(response, requestOptions);
  },

  async post(url: string, data?: any, options: RequestInit = {}) {
    const token = getAuthToken();
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include', // For refresh token cookies
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    };
    const response = await fetch(`${API_BASE_URL}${url}`, requestOptions);
    return handleResponse(response, requestOptions);
  },

  async patch(url: string, data?: any, options: RequestInit = {}) {
    const token = getAuthToken();
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include', // For refresh token cookies
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    };
    const response = await fetch(`${API_BASE_URL}${url}`, requestOptions);
    return handleResponse(response, requestOptions);
  },

  async delete(url: string, options: RequestInit = {}) {
    const token = getAuthToken();
    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include', // For refresh token cookies
      ...options,
    };
    const response = await fetch(`${API_BASE_URL}${url}`, requestOptions);
    return handleResponse(response, requestOptions);
  },
};