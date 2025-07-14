import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { ICustomFees } from 'src/api/live/types'
import { AppState } from 'src/app/store'

export interface OrderSummaryData {
  totalPrice: string
  customFees: ICustomFees[]
  totalServiceFee: string
  totalSalesTax: string
  total: string
}

export enum OrderSummaryStatus {
  Idle = 'idle',
  Loading = 'loading',
  Succeeded = 'succeeded',
  Failed = 'failed',
}

interface OrderSummarySlice {
  data: OrderSummaryData
  status: OrderSummaryStatus
}

export const defaultOrderSummaryData: OrderSummaryData = {
  totalPrice: '0.00',
  customFees: [],
  totalServiceFee: '0.00',
  totalSalesTax: '0.00',
  total: '',
}

const initialState: OrderSummarySlice = {
  data: defaultOrderSummaryData,
  status: OrderSummaryStatus.Idle,
}

export const orderSummarySlice = createSlice({
  name: 'orderSummary',
  initialState,
  reducers: {
    updateOrderSummary: (
      state,
      action: PayloadAction<Partial<OrderSummaryData>>
    ) => {
      Object.assign(state.data, action.payload)
    },
    setOrderSummaryStatus: (
      state,
      action: PayloadAction<OrderSummaryStatus>
    ) => {
      state.status = action.payload
    },
  },
})

export const { updateOrderSummary, setOrderSummaryStatus } =
  orderSummarySlice.actions

export const selectOrderSummary = (state: AppState) => state.orderSummary.data

export const selectOrderSummaryTotal = (state: AppState) =>
  state.orderSummary.data.total

export const selectIsTotalAmountZero = (state: AppState) => {
  const orderSummaryTotal = selectOrderSummaryTotal(state)

  return orderSummaryTotal === '' ? false : Number(orderSummaryTotal) === 0
}

export const selectOrderSummaryStatus = (state: AppState) =>
  state.orderSummary.status

export default orderSummarySlice.reducer
