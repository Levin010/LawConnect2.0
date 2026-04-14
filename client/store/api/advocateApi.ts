import { baseApi } from './baseApi';

export interface AdvocateSearchParams {
  search?: string;
  category?: string;
  county?: string;
}

export interface UserSummary {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
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
  firstName: string;
  lastName: string;
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
  id: string;
  client: UserSummary;
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
  firstName: string;
  lastName: string;
  email: string;
}

export interface LegalCase {
  id: string;
  caseName: string;
  caseNumber: string;
  clientRole: 'PLAINTIFF_PETITIONER' | 'DEFENDANT_RESPONDENT';
  caseDescription: string;
  status: 'OPEN' | 'CLOSED';
  dateLaunched: string;
  client: UserSummary | null;
  advocate: UserSummary | null;
}

export interface CaseUpdate {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  documents: { id: number; fileName: string; fileUrl: string }[];
}

export interface CreateCaseUpdateDto {
  title: string;
  description: string;
  documents?: File[];
}

export const advocateApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAdvocates: builder.query<AdvocateProfile[], AdvocateSearchParams>({
      query: (params) => ({url: '/profile/advocates',params,
      }),
    }),
    getAdvocateDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/cases/dashboard/stats',
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
    updateRequestStatus: builder.mutation<void, { requestId: string; status: 'ACCEPTED' | 'REJECTED' }>({
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
    getAdvocateCases: builder.query<LegalCase[], void>({
      query: () => '/cases/my-cases',
      providesTags: ['Cases'],
    }),
    getCaseById: builder.query<LegalCase, string>({
      query: (id) => `/cases/${id}`,
      providesTags: ['Cases'],
    }),
    closeCase: builder.mutation<void, string>({
      query: (id) => ({
        url: `/cases/${id}/close`,
        method: 'PUT',
        responseHandler: 'text',
      }),
      invalidatesTags: ['Cases'],
    }),
    reopenCase: builder.mutation<void, string>({
      query: (id) => ({
        url: `/cases/${id}/reopen`,
        method: 'PUT',
        responseHandler: 'text',
      }),
      invalidatesTags: ['Cases'],
    }),
    getCaseUpdates: builder.query<CaseUpdate[], string>({
      query: (caseId) => `/cases/${caseId}/updates`,
      providesTags: ['CaseUpdates'],
    }),
    createCaseUpdate: builder.mutation<void, { caseId: string; formData: FormData }>({
      query: ({ caseId, formData }) => ({
        url: `/cases/${caseId}/updates`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['CaseUpdates'],
    }),
    updateCaseUpdate: builder.mutation<CaseUpdate, { caseId: string; updateId: string; formData: FormData }>({
      query: ({ caseId, updateId, formData }) => ({
        url: `/cases/${caseId}/updates/${updateId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['CaseUpdates'],
    }),
    deleteCaseUpdate: builder.mutation<void, { caseId: string; updateId: string; }>({
      query: ({ caseId, updateId }) => ({
        url: `/cases/${caseId}/updates/${updateId}`,
        method: 'DELETE',
        responseHandler: 'text',
      }),
      invalidatesTags: ['CaseUpdates'],
    }),
    updateCase: builder.mutation<LegalCase, { id: string; body: CreateCaseDto }>({
      query: ({ id, body }) => ({
        url: `/cases/${id}`,
        method: 'PUT',
        body,
        responseHandler: 'text',
      }),
      invalidatesTags: ['Cases'],
    }),
  }),
});

export const { 
    useGetAdvocatesQuery,
    useGetAdvocateDashboardStatsQuery,
    useGetAdvocateProfileQuery,
    useUpdateAdvocateProfileMutation,
    useGetAdvocateByUsernameQuery,
    useGetReceivedRequestsQuery,
    useUpdateRequestStatusMutation,
    useCreateCaseMutation,
    useSearchClientsQuery,
    useGetAdvocateCasesQuery,
    useGetCaseByIdQuery,
    useCloseCaseMutation,
    useGetCaseUpdatesQuery,
    useCreateCaseUpdateMutation,
    useUpdateCaseMutation,
    useReopenCaseMutation,
    useUpdateCaseUpdateMutation,
    useDeleteCaseUpdateMutation
 } = advocateApi;
