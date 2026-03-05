import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveToken, clearToken, getRoleFromToken } from '@/lib/auth';

interface AuthState {
  token: string | null;
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  username: null,
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; username: string }>) {
      const { token, username } = action.payload;
      state.token = token;
      state.username = username;
      state.role = getRoleFromToken(token);
      state.isAuthenticated = true;
      saveToken(token);
    },
    logout(state) {
      state.token = null;
      state.username = null;
      state.role = null;
      state.isAuthenticated = false;
      clearToken();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;