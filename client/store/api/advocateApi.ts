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

export const advocateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdvocates: builder.query<Advocate[], AdvocateSearchParams>({
      query: (params) => ({
        url: '/advocates',
        params,
      }),
    }),
  }),
});

export const { useGetAdvocatesQuery } = advocateApi;