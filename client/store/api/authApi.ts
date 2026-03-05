import { baseApi } from './baseApi';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  role: 'CLIENT' | 'ADVOCATE';
}

interface AuthTokenResponse {
  token: string;
}

export const authApi = baseApi.injectEndpoints({
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
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;