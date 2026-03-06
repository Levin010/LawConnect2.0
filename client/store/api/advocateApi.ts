import { baseApi } from './baseApi';

export interface Advocate {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  lawFirm: string;
  county: string;
  profilePhoto?: string;
}

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

export const advocateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdvocates: builder.query<Advocate[], AdvocateSearchParams>({
      query: (params) => ({url: '/advocates',params,
      }),
    }),
    getAdvocateDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/advocates/dashboard/stats',
    }),
    getAdvocateOpenCases: builder.query<OpenCase[], void>({
      query: () => '/advocates/dashboard/open-cases',
    }),
  }),
});

export const { 
    useGetAdvocatesQuery,
    useGetAdvocateDashboardStatsQuery,
    useGetAdvocateOpenCasesQuery
 } = advocateApi;