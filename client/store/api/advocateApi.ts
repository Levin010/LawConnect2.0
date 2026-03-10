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

export interface ReceivedRequest {
  id: number;
  client: { id: number; name: string; username: string };
  firstName: string;
  lastName: string;
  partyRole: 'PLAINTIFF_PETITIONER' | 'DEFENDANT_RESPONDENT';
  caseDescription: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requestedAt: string;
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
    getReceivedRequests: builder.query<ReceivedRequest[], void>({
      query: () => '/representation-requests/incoming',
      providesTags: ['Requests'],
    }),
    updateRequestStatus: builder.mutation<void, { requestId: number; status: 'ACCEPTED' | 'REJECTED' }>({
      query: ({ requestId, status }) => ({
        url: `/representation-requests/${requestId}/status?status=${status}`,
        method: 'PUT',
        responseHandler: 'text',
      }),
      invalidatesTags: ['Requests'],
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
    useGetReceivedRequestsQuery,
    useUpdateRequestStatusMutation,
 } = advocateApi;