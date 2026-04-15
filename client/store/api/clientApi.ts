import { baseApi } from './baseApi';
import { LegalCase, UserSummary } from './advocateApi';

export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  closedCases: number;
}

export interface ClientProfile {
  // From User
  firstName: string;
  lastName: string;
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

export interface RepresentationRequest {
  advocateUsername: string;
  firstName: string;
  lastName: string;
  clientRole: 'PLAINTIFF_PETITIONER' | 'DEFENDANT_RESPONDENT';
  caseDescription: string;
}

export interface SentRequest {
  id: string;
  advocate: UserSummary;
  firstName: string;
  lastName: string;
  clientRole: 'PLAINTIFF_PETITIONER' | 'DEFENDANT_RESPONDENT';
  caseDescription: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requestedAt: string;
}

export interface Review {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PostReview {
  advocateUsername: string;
  rating: number;
  comment: string;
}

export const clientApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getClientDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/cases/dashboard/stats/client',
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
    sendRepresentationRequest: builder.mutation<void, RepresentationRequest>({
    query: (body) => ({
        url: '/representation-requests',
        method: 'POST',
        body,
        responseHandler: 'text',
    }),
    }),
    getAdvocateReviews: builder.query<Review[], string>({
    query: (username) => `/reviews/${username}`,
    providesTags: ['Reviews'],
    }),
    postReview: builder.mutation<void, PostReview>({
    query: (body) => ({
        url: '/reviews',
        method: 'POST',
        body,
        responseHandler: 'text',
    }),
    invalidatesTags: ['Reviews'],
    }),
    getSentRequests: builder.query<SentRequest[], void>({
    query: () => '/representation-requests/my-requests',
    providesTags: ['Requests'],
    }),
    getClientCases: builder.query<LegalCase[], void>({
      query: () => '/cases/my-cases/client',
      providesTags: ['Cases'],
    }),
    getCaseById: builder.query<LegalCase, string>({
      query: (id) => `/cases/${id}`,
      providesTags: ['Cases'],
    }),
  }),
});

export const { 
    useGetClientDashboardStatsQuery,
    useGetClientProfileQuery,
    useUpdateClientProfileMutation,
    useSendRepresentationRequestMutation,
    useGetAdvocateReviewsQuery,
    usePostReviewMutation,
    useGetSentRequestsQuery,
    useGetClientCasesQuery,
    useGetCaseByIdQuery,
 } = clientApi;
