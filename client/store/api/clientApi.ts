import { baseApi } from './baseApi';

export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  closedCases: number;
}

export interface OpenCase {
  id: number;
  dateOpened: string;
  advocateName: string;
  caseName: string;
}

export interface ClientProfile {
  // From User
  name: string;
  email: string;
  phone: string;
  username: string;
  // From ClientProfileDto
  gender: string;
  county: string;
  address: string;
  postalAddress: string;
  profilePicture: string | null;
}

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/clients/dashboard/stats',
    }),
    getClientOpenCases: builder.query<OpenCase[], void>({
      query: () => '/clients/dashboard/open-cases',
    }),
    getClientProfile: builder.query<ClientProfile, void>({
      query: () => '/profile/client',
      providesTags: ['ClientProfile'],
    }),
    updateClientProfile: builder.mutation<void, Partial<ClientProfile>>({
    query: (body) => ({
        url: '/profile/client',
        method: 'PUT',
        body,
        responseHandler: 'text',
    }),
    invalidatesTags: ['ClientProfile'],
    }),
  }),
});

export const { 
    useGetClientDashboardStatsQuery,
    useGetClientOpenCasesQuery,
    useGetClientProfileQuery,
    useUpdateClientProfileMutation,
 } = clientApi;