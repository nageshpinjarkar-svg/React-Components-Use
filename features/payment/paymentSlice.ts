import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AppState } from 'src/app/store'

import { BillingAddress, PaymentSlice } from './types'

const initialState: PaymentSlice = {
  paymentType: null,
  card: null,
  browserInfo: null,
  billingAddress: {
    city: '',
    country: '',
    postalCode: '',
    state: '',
    street: '',
    street2: '',
  },
  stripeCardToken: null,
}

export const paymentSlice = createSlice({
  initialState: initialState,
  name: 'payment',
  reducers: {
    updatePaymentMethod: (
      state,
      action: PayloadAction<PaymentSlice['paymentType']>
    ) => {
      state.paymentType = action.payload
    },
    updateCard: (state, action: PayloadAction<PaymentSlice['card']>) => {
      state.card = action.payload
    },
    updateBrowserInfo: (
      state,
      action: PayloadAction<PaymentSlice['browserInfo']>
    ) => {
      state.browserInfo = action.payload
    },
    updateBillingAddress: (state, action: PayloadAction<BillingAddress>) => {
      state.billingAddress = action.payload
    },
    updateStripeCardToken: (state, action: PayloadAction<string>) => {
      state.stripeCardToken = action.payload
    },
    resetPaymentType: (state) => {
      state.paymentType = null
    },
  },
})

export const {
  updateCard,
  updateBrowserInfo,
  updatePaymentMethod,
  updateBillingAddress,
  updateStripeCardToken,
  resetPaymentType,
} = paymentSlice.actions

export const selectPayment = (state: AppState) => state.payment
export const selectPaymentType = (state: AppState) => state.payment.paymentType
export const selectStripeCardToken = (state: AppState) =>
  state.payment.stripeCardToken

export default paymentSlice.reducer
