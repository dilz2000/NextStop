
const BASE_URL = 'http://localhost:8095/api';

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

export interface UserProfileData {
  id: number;
  fullName: string;
  email: string;
  emailVerified: boolean;
  active: boolean;
  roles: string[];
}

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
}

// Fetch current user's profile data
export const fetchCurrentUserProfile = async (): Promise<UserProfileData> => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: createAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update current user's profile
export const updateUserProfile = async (profileData: UpdateProfileRequest): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: 'PUT',
      headers: createAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update profile: ${errorText || response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update localStorage with new user data
export const updateLocalStorageUser = (updatedData: Partial<UserProfileData>): void => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const currentUser = JSON.parse(userData);
      const updatedUser = { ...currentUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  } catch (error) {
    console.error('Error updating localStorage:', error);
  }
};
