const BASE_URL = 'http://localhost:8765/user-service/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to create headers with auth token
const createAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export interface AdminProfile {
  id: number;
  fullName: string;
  email: string;
  emailVerified: boolean;
  active: boolean;
  roles: string[];
}

export const fetchCurrentAdminProfile = async (userId: number): Promise<AdminProfile> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
      method: 'GET',
      headers: createAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching admin profile from API:', error);
    throw error;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const getCurrentUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};
