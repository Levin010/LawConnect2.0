import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getRefreshToken, getToken } from '@/lib/auth';
import { logout, updateTokens } from '@/store/slices/authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

let refreshPromise: Promise<boolean> | null = null;

function shouldAttemptRefresh(args: string | FetchArgs) {
  const url = typeof args === 'string' ? args : args.url;
  return !['/users/auth', '/users/register', '/users/refresh'].includes(url);
}

const baseQueryWithRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && shouldAttemptRefresh(args)) {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshResult = await rawBaseQuery(
          {
            url: '/users/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          api.dispatch(updateTokens(refreshResult.data as { token: string; refreshToken: string }));
          return true;
        }

        api.dispatch(logout());
        return false;
      })().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;
    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  tagTypes: ['AdvocateProfile', 'ClientProfile', 'Reviews', 'Requests', 'Cases', 'CaseUpdates', 'Chat'],
  baseQuery: baseQueryWithRefresh,
  endpoints: () => ({}),
});
