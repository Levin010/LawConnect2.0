import { baseApi } from './baseApi';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  role: 'CLIENT' | 'ADVOCATE';
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

interface AuthTokenResponse {
  token: string;
  refreshToken: string;
}

interface MessageResponse {
  message: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<AuthTokenResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/users/auth',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<void, RegisterRequest>({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
    }),
    requestPasswordReset: builder.mutation<MessageResponse, ForgotPasswordRequest>({
      query: (payload) => ({
        url: '/users/forgot-password',
        method: 'POST',
        body: payload,
      }),
    }),
    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: (payload) => ({
        url: '/users/reset-password',
        method: 'POST',
        body: payload,
      }),
    }),
    refresh: builder.mutation<AuthTokenResponse, RefreshTokenRequest>({
      query: (payload) => ({
        url: '/users/refresh',
        method: 'POST',
        body: payload,
      }),
    }),
    logout: builder.mutation<void, RefreshTokenRequest | void>({
      query: (payload) => ({
        url: '/users/logout',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useRefreshMutation,
  useLogoutMutation,
} = authApi;
