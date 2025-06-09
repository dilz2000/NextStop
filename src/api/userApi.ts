const BASE_URL = 'http://localhost:8095/api';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken'); //  key use for storing the token
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

export interface UserFromAPI {
  id: number;
  fullName: string;
  email: string;
  emailVerified: boolean;
  active: boolean;
  roles: string[];
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  emailVerified: boolean;
  active: boolean;
  roles: string[];
}

export interface UserUpdateRequest {
  fullName: string;
  email: string;
  emailVerified: boolean;
  active: boolean;
}

export interface UserRoleUpdateRequest {
  roles: string[];
}

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/users`, {
      method: 'GET',
      headers: createAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: UserFromAPI[] = await response.json();
    return data.map(user => ({
      ...user,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserById = async (userId: number): Promise<User> => {
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
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUser = async (userId: number, userData: UserUpdateRequest): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: createAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update user: ${errorText || response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const updateUserRole = async (userId: number, roleData: UserRoleUpdateRequest): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/roles`, {
      method: 'PUT',
      headers: createAuthHeaders(),
      body: JSON.stringify(roleData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update user role: ${errorText || response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};
