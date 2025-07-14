import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'

import entriesReducer from 'src/features/entries/entriesSlice'
import paymentReducer from 'src/features/payment/paymentSlice'
import orderSummaryReducer from 'src/features/orderSummary/orderSummarySlice'
import languageReducer from 'src/components/LanguageSelector/languageSlice'
import { api } from 'src/api/event'
import { liveApi } from 'src/api/live'
import policyReducer from 'src/features/policy/policySlice'
import sessionReducer from 'src/features/session/sessionSlice'
import waiverSliceReducer from 'src/features/waiver/waiverSlice'

export function makeStore() {
  return configureStore({
    reducer: {
      entries: entriesReducer,
      policy: policyReducer,
      payment: paymentReducer,
      orderSummary: orderSummaryReducer,
      session: sessionReducer,
      language: languageReducer,
      waivers: waiverSliceReducer,
      [api.reducerPath]: api.reducer,
      [liveApi.reducerPath]: liveApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware, liveApi.middleware),
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppStore = ReturnType<typeof makeStore>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store

export const wrapper = createWrapper<AppStore>(makeStore)
