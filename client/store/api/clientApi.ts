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

export interface RepresentationRequest {
  advocateUsername: string;
  firstName: string;
  lastName: string;
  partyRole: 'PLAINTIFF_PETITIONER' | 'DEFENDANT_RESPONDENT';
  caseDescription: string;
}

export interface SentRequest {
  id: number;
  advocate: { id: number; name: string; username: string };
  firstName: string;
  lastName: string;
  partyRole: 'PLAINTIFF_PETITIONER' | 'DEFENDANT_RESPONDENT';
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
  }),
});

export const { 
    useGetClientDashboardStatsQuery,
    useGetClientOpenCasesQuery,
    useGetClientProfileQuery,
    useUpdateClientProfileMutation,
    useSendRepresentationRequestMutation,
    useGetAdvocateReviewsQuery,
    usePostReviewMutation,
    useGetSentRequestsQuery,
 } = clientApi;