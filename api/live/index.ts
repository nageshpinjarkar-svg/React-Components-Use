import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { AppState } from 'src/app/store'

import {
  RegistrationCheckInEntriesPayload,
  RegistrationCheckInEntriesResponse,
  RegistrationTransactionPayload,
  RegistrationTransactionResponse,
  PostConsumerSurveyPayload,
  PostConsumerSurveyResponse,
  PostOrderSummaryPayload,
  PostOrderSummaryResponse,
  GetRegionByZipCodePayload,
  GetRegionByZipCodeResponse,
} from './types'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as AppState).session.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    } else {
      console.warn('No token available for API call')
    }
    return headers
  },
})

export const liveApi = createApi({
  reducerPath: 'liveApi',
  baseQuery,
  endpoints: (build) => ({
    createAnonymousSession: build.mutation<{ token: string }, void>({
      query: () => ({
        url: 'registration/createAnonymousSession',
        method: 'POST',
        body: {
          clientId: 'registration',
        },
      }),
    }),
    postTransaction: build.mutation<
      RegistrationTransactionResponse,
      RegistrationTransactionPayload
    >({
      query: (body) => ({
        url: 'registration/transaction',
        method: 'POST',
        body,
      }),
    }),
    assignBibs: build.mutation<
      RegistrationCheckInEntriesResponse,
      RegistrationCheckInEntriesPayload
    >({
      query: ({ eventId, ...body }) => ({
        url: `registration/event/${eventId}/checkin-entries`,
        method: 'PUT',
        body,
      }),
    }),
    postConsumerSurvey: build.mutation<
      PostConsumerSurveyResponse,
      PostConsumerSurveyPayload
    >({
      query: (body) => ({
        url: 'registration/consumer-survey',
        method: 'POST',
        body,
      }),
    }),
    postOrderSummary: build.mutation<
      PostOrderSummaryResponse,
      PostOrderSummaryPayload
    >({
      query: ({ eventId, ...body }) => ({
        url: `registration/event/${eventId}/order-summary`,
        method: 'POST',
        body,
      }),
    }),
    getRegionByZipCode: build.mutation<
      GetRegionByZipCodeResponse,
      GetRegionByZipCodePayload
    >({
      query: ({ zipCode }) => ({
        url: `registration/zip/${zipCode}/city-info`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useCreateAnonymousSessionMutation,
  usePostTransactionMutation,
  useAssignBibsMutation,
  usePostConsumerSurveyMutation,
  usePostOrderSummaryMutation,
  useGetRegionByZipCodeMutation,
} = liveApi
