import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { authService } from '../../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialUser = authService.getCurrentUser();

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (phoneOrEmail: string, { rejectWithValue }) => {
    try {
      const user = await authService.login(phoneOrEmail);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to login');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: Partial<User> & { street?: string; area?: string; city?: string; pincode?: string }, { rejectWithValue }) => {
    try {
      const user = await authService.register(userData);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to register');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    await authService.logout();
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates: Partial<User>, { rejectWithValue }) => {
    try {
      const user = await authService.updateProfile(updates);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    switchRole: (state, action: PayloadAction<'customer' | 'vendor' | 'admin'>) => {
      if (state.user) {
        state.user.role = action.payload;
        if (action.payload === 'vendor') {
          state.user.kitchenName = 'Sharma Ji Shuddh Desi Rasoi';
          state.user.name = 'Rajesh Sharma (Sharma Ji Rasoi)';
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { setUser, switchRole } = authSlice.actions;
export default authSlice.reducer;
