
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8765/user-service/api/auth';

export interface UserRegistrationRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  status: number;
}

// Authentication utility functions
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('authToken');
    return !!token;
  };
  
  export const redirectToLogin = (): void => {
    window.location.href = '/login';
  };
  

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add response interceptor for better error handling
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
      };
      return Promise.reject(apiError);
    } else if (error.request) {
      // Network error
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      });
    } else {
      // Other error
      return Promise.reject({
        message: 'An unexpected error occurred.',
        status: 0,
      });
    }
  }
);

export const registerUser = async (userData: UserRegistrationRequest): Promise<any> => {
  try {
    const response = await authApi.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration API error:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<any> => {
  try {
    const response = await authApi.post('/login', { email, password });
    console.log("LOGIN RESPONSE: ", response)
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};
