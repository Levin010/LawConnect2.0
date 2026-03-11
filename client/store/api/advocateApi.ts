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
  clientRole: 'PLAINTIFF_PETITIONER' | 'DEFENDANT_RESPONDENT';
  caseDescription: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requestedAt: string;
}

export interface CreateCaseDto {
  caseName: string;
  caseNumber: string;
  clientRole: 'PLAINTIFF_PETITIONER' | 'DEFENDANT_RESPONDENT';
  caseDescription: string;
  clientUsername?: string;
}

export interface ClientUser {
  username: string;
  name: string;
  email: string;
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
    createCase: builder.mutation<void, CreateCaseDto>({
      query: (body) => ({
        url: '/cases',
        method: 'POST',
        body,
        responseHandler: 'text',
      }),
      invalidatesTags: ['Cases'],
    }),
    searchClients: builder.query<ClientUser[], string>({
      query: (search) => `/users/clients/search?query=${search}`,
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
    useCreateCaseMutation,
    useSearchClientsQuery,
 } = advocateApi;