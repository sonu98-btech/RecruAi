import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/auth.api';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authApi.login(credentials);
    return data; // contains user, success, message
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerCompany = createAsyncThunk('auth/registerCompany', async (companyData, { rejectWithValue }) => {
  try {
    const data = await authApi.registerCompany(companyData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const loadCurrentUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const data = await authApi.getCurrentUser();
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load user');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    return null;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

const initialState = {
  currentUser: null,
  loading: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedCompany: (state, action) => {
      if (state.currentUser && state.currentUser.role === 'SUPER_ADMIN') {
        localStorage.setItem('selectedCompanyId', action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data?.user || action.payload.data;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register Company
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data?.user || action.payload.data;
        state.error = null;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load User
      .addCase(loadCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.currentUser = action.payload.data?.user || action.payload.data;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.currentUser = null;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        localStorage.removeItem('selectedCompanyId');
      });
  },
});

export const { clearError, setSelectedCompany } = authSlice.actions;
export default authSlice.reducer;
