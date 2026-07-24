import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const demoDefaultUser = {
  id: 'pin641001',
  name: '641001 Pincode Agent',
  email: 'agent641001@forgeindia.in',
  role: 'Pincode Agent',
  pincode: '641001',
  district: 'Coimbatore',
  state: 'Tamil Nadu',
  token: 'demo-token-641001'
};

const getInitialUser = () => {
  try {
    const item = localStorage.getItem('user');
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const storedUser = getInitialUser();

const initialState = {
  user: storedUser,
  token: storedUser ? storedUser.token : null,
  isAuthenticated: storedUser ? true : false,
  isLoading: false,
  isError: false,
  message: '',
};

// Login user
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await axios.post('/api/auth/login', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
