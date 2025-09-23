// API service for handling backend requests
// Base URL is now handled by the useApi hook

// Helper function to handle API errors
const handleAPIError = async (response: Response) => {
  let errorMessage = 'An unexpected error occurred';
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.detail || errorData.message || errorMessage;
  } catch (e) {
    // If we can't parse the error response, use the status text
    errorMessage = response.statusText || errorMessage;
  }
  
  return new Error(errorMessage);
};

// Auth API endpoints
export const authAPI = {
  register: async (userData: { email: string; password: string }) => {
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw await handleAPIError(response);
      }
      
      return response.json();
    } catch (error) {
      // Re-throw the error so it can be handled by the calling function
      throw error;
    }
  },
  
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw await handleAPIError(response);
      }
      
      return response.json();
    } catch (error) {
      // Re-throw the error so it can be handled by the calling function
      throw error;
    }
  },
  
  generateAPIKey: async (token: string, name?: string) => {
    try {
      const url = name 
        ? `/generate-key?name=${encodeURIComponent(name)}`
        : `/generate-key`;
        
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw await handleAPIError(response);
      }
      
      return response.json();
    } catch (error) {
      // Re-throw the error so it can be handled by the calling function
      throw error;
    }
  },
  
  getAPIKeys: async (token: string) => {
    try {
      const response = await fetch('/api-keys', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw await handleAPIError(response);
      }
      
      return response.json();
    } catch (error) {
      // Re-throw the error so it can be handled by the calling function
      throw error;
    }
  },
  
  deleteAPIKey: async (token: string, keyId: string) => {
    try {
      const response = await fetch(`/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw await handleAPIError(response);
      }
      
      return response.json();
    } catch (error) {
      // Re-throw the error so it can be handled by the calling function
      throw error;
    }
  },
  
  regenerateAPIKey: async (token: string, keyId: string) => {
    try {
      const response = await fetch(`/api-keys/${keyId}/regenerate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw await handleAPIError(response);
      }
      
      return response.json();
    } catch (error) {
      // Re-throw the error so it can be handled by the calling function
      throw error;
    }
  }
};

// Types for API responses
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  id_token: string;
}

export interface RegisterResponse {
  // Registration response structure
}

export interface APIKeyResponse {
  api_key: string;
}

// User data types
export interface UserCreate {
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}