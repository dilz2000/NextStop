
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

// export const registerUser = async (userData: UserRegistrationRequest): Promise<any> => {
//   try {
//     const response = await authApi.post('/register', userData);
//     return response.data;
//   } catch (error) {
//     console.error('Registration API error:', error);
//     throw error;
//   }
// };

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


export const registerUser = async (userData: UserRegistrationRequest): Promise<any> => {
  try {
    console.log("Sending registration request to:", API_BASE_URL + '/register');
    console.log("Request data:", userData);
    
    const response = await authApi.post('/register', userData);
    
    console.log("Full response object:", response);
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
    console.log("Response headers:", response.headers);
    
    return response.data;
  } catch (error) {
    console.error('Registration API error:', error);
    console.error('Error type:', typeof error);
    console.error('Error response:', error.response);
    console.error('Error request:', error.request);
    console.error('Error message:', error.message);
    throw error;
  }
};
