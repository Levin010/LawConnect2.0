import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveToken, saveRefreshToken, clearAuthTokens, getRoleFromToken } from '@/lib/auth';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  username: string | null;
  role: string | null;
  userId: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  username: null,
  role: null,
  userId: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; refreshToken: string; username: string }>) {
      const { token, refreshToken, username } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.username = username;
      state.role = getRoleFromToken(token);
      state.isAuthenticated = true;
      saveToken(token);
      saveRefreshToken(refreshToken);
    },
    updateTokens(state, action: PayloadAction<{ token: string; refreshToken: string }>) {
      const { token, refreshToken } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.role = getRoleFromToken(token);
      state.isAuthenticated = true;
      saveToken(token);
      saveRefreshToken(refreshToken);
    },
    logout(state) {
      state.token = null;
      state.refreshToken = null;
      state.username = null;
      state.role = null;
      state.isAuthenticated = false;
      state.userId = null;
      clearAuthTokens();
    },
    setUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
  },
});

export const { setCredentials, updateTokens, logout, setUserId } = authSlice.actions;
export default authSlice.reducer;
