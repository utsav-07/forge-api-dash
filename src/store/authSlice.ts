import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI, APIResponse, LoginResponse } from '@/lib/api';

// Define types
interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response: APIResponse<LoginResponse> = await authAPI.login(credentials);
      
      if (response.success && response.data?.id_token) {
        // Extract name from email
        const name = credentials.email.includes('@') 
          ? credentials.email.split('@')[0] 
          : credentials.email;
        
        const user = {
          email: credentials.email,
          name: name.charAt(0).toUpperCase() + name.slice(1)
        };
        
        return { user, token: response.data.id_token };
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk<
  string, // Just return success message
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response: APIResponse = await authAPI.register(userData);
      
      if (response.success) {
        return response.message || 'Registration successful';
      } else {
        return rejectWithValue(response.message || 'Registration failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      // Clear from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    },
    clearError: (state) => {
      state.error = null;
    },
    // For initializing auth state from localStorage
    initializeAuth: (state) => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          state.token = token;
          state.user = JSON.parse(userData);
        } catch (e) {
          // If there's an error parsing userData, clear both
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          state.token = null;
          state.user = null;
        }
      }
    }
  },
  extraReducers: (builder) => {
    // Login reducers
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        
        // Store in localStorage
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('userData', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      
      // Register reducers
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { logout, clearError, initializeAuth } = authSlice.actions;
export default authSlice.reducer;