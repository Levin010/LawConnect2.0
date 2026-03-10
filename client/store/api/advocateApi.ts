import { baseApi } from './baseApi';

export interface AdvocateSearchParams {
  search?: string;
  category?: string;
  county?: string;
}

export interface DashboardStats {
  totalCases: number;
  activeClients: number;
  activeCases: number;
  closedCases: number;
}

export interface OpenCase {
  id: number;
  dateOpened: string;
  clientName: string;
  caseName: string;
}

export interface AdvocateProfile {
  // From User
  name: string;
  email: string;
  phone: string;
  username: string;
  // From AdvocateProfileDto
  gender: string;
  category: string;
  lawFirm: string;
  county: string;
  address: string;
  postalAddress: string;
  experience: number | null;
  bio: string;
  profilePicture: string | null;
  practicingCertificate: string | null;
}

export const advocateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdvocates: builder.query<AdvocateProfile[], AdvocateSearchParams>({
      query: (params) => ({url: '/profile/advocates',params,
      }),
    }),
    getAdvocateDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/advocates/dashboard/stats',
    }),
    getAdvocateOpenCases: builder.query<OpenCase[], void>({
      query: () => '/advocates/dashboard/open-cases',
    }),
    getAdvocateProfile: builder.query<AdvocateProfile, void>({
    query: () => '/profile/advocate',
    providesTags: ['AdvocateProfile'],
    }),
    updateAdvocateProfile: builder.mutation<void, Partial<AdvocateProfile>>({
    query: (body) => ({
        url: '/profile/advocate',
        method: 'PUT',
        body,
        responseHandler: 'text',
    }),
    invalidatesTags: ['AdvocateProfile'],
    }),
    getAdvocateByUsername: builder.query<AdvocateProfile, string>({
      query: (username) => `profile/advocates/${username}`,
    }),
  }),
});

export const { 
    useGetAdvocatesQuery,
    useGetAdvocateDashboardStatsQuery,
    useGetAdvocateOpenCasesQuery,
    useGetAdvocateProfileQuery,
    useUpdateAdvocateProfileMutation,
    useGetAdvocateByUsernameQuery,
 } = advocateApi;