import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'

import { EmailData, EventData } from './types'

export const api = createApi({
  reducerPath: 'api',
  tagTypes: [],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REG2_URL}/api`,
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
  endpoints: (builder) => ({
    getRegistrationEventById: builder.query<EventData, number>({
      query: (eventId) => `/event/${eventId}`,
    }),
    getEmailById: builder.query<EmailData, string>({
      query: (emailId: string) => `/email/${emailId}`,
    }),
  }),
})

export const {
  useGetRegistrationEventByIdQuery,
  useGetEmailByIdQuery,
  util: { getRunningQueriesThunk: getRunningEventQueriesThunk },
} = api

// export endpoints for use in SSR
export const { getRegistrationEventById, getEmailById } = api.endpoints
