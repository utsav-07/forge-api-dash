import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

// API base URL - matches the backend server
const API_BASE_URL = 'http://18.212.82.121:8000';

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

interface UseApiReturn {
  callApi: <T = any>(url: string, options?: ApiOptions) => Promise<T>;
  getAuthHeaders: () => HeadersInit;
}

export const useApi = (): UseApiReturn => {
  const token = useSelector((state: RootState) => state.auth.token);

  const getAuthHeaders = useCallback((): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }, [token]);

  const callApi = useCallback(
    async <T = any>(url: string, options: ApiOptions = {}): Promise<T> => {
      const { requiresAuth = false, headers = {}, ...restOptions } = options;
      
      // Construct full URL - prepend base URL if not already absolute
      const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
      
      // Merge headers
      const mergedHeaders = {
        ...getAuthHeaders(),
        ...headers,
      };
      
      // If auth is required but no token, throw error
      if (requiresAuth && !token) {
        throw new Error('Authentication required but no token available');
      }
      
      const response = await fetch(fullUrl, {
        headers: mergedHeaders,
        ...restOptions,
      });
      
      if (!response.ok) {
        let errorMessage = 'API request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      return response.json();
    },
    [getAuthHeaders, token]
  );

  return { callApi, getAuthHeaders };
};