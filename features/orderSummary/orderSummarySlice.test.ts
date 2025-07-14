import { AppState } from 'src/app/store'
import { commonInitialAppState } from 'src/features/shared/data'

import {
  OrderSummaryStatus,
  defaultOrderSummaryData,
  orderSummarySlice,
  selectOrderSummary,
  selectOrderSummaryTotal,
} from './orderSummarySlice'

describe('Redux Slice: orderSummarySlice', () => {
  const initialState: AppState = {
    ...commonInitialAppState,
    orderSummary: {
      data: defaultOrderSummaryData,
      status: OrderSummaryStatus.Idle,
    },
  }

  it('should handle initial state', () => {
    const nextState = orderSummarySlice.reducer(undefined, { type: 'unknown' })
    expect(nextState).toEqual(initialState.orderSummary)
  })

  it('should handle updateOrderSummary', () => {
    const newOrderSummaryData = {
      totalPrice: '100.00',
      customFees: [],
      totalServiceFee: '10.00',
      totalSalesTax: '5.00',
      total: '115.00',
    }
    const nextState = orderSummarySlice.reducer(
      initialState.orderSummary,
      orderSummarySlice.actions.updateOrderSummary(newOrderSummaryData)
    )
    expect(nextState.data).toEqual(newOrderSummaryData)
    expect(nextState.status).toEqual('idle')
  })

  it('should handle partial update of orderSummary', () => {
    const partialUpdate = {
      total: '200.00',
    }
    const nextState = orderSummarySlice.reducer(
      initialState.orderSummary,
      orderSummarySlice.actions.updateOrderSummary(partialUpdate)
    )
    expect(nextState.data.total).toEqual(partialUpdate.total)
    expect(nextState.data.totalPrice).toEqual(
      initialState.orderSummary.data.totalPrice
    )
  })

  it('should handle updating arrays correctly', () => {
    const newCustomFees = [{ name: 'Fee1', fee: '5.00' }]
    const nextState = orderSummarySlice.reducer(
      initialState.orderSummary,
      orderSummarySlice.actions.updateOrderSummary({
        customFees: newCustomFees,
      })
    )
    expect(nextState.data.customFees).toEqual(newCustomFees)
  })

  describe('selectors', () => {
    it('selectOrderSummary', () => {
      expect(selectOrderSummary(initialState)).toEqual(
        initialState.orderSummary.data
      )
    })

    it('selectOrderSummaryTotal', () => {
      expect(selectOrderSummaryTotal(initialState)).toEqual(
        initialState.orderSummary.data.total
      )
    })
  })
})
