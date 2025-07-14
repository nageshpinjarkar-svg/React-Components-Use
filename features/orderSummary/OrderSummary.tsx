import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { AppState } from 'src/app/store'
import {
  SECTION_ORDER_SUMMARY,
  SECTION_PAYMENT,
} from 'src/features/policy/constants'

import { selectSectionStatus, updateSectionStatus } from '../policy/policySlice'
import { useGetCurrentUxMode } from '../shared/hooks'

const OrderSummaryContentLazy = dynamic(() =>
  import('./OrderSummaryContent').then((mod) => mod.default)
)

const OrderSummary = () => {
  const dispatch = useDispatch()
  const { isScrollMode, isScreensMode } = useGetCurrentUxMode()

  const { isVisible: isVisibleSection } = useSelector((state: AppState) =>
    selectSectionStatus(state, SECTION_ORDER_SUMMARY)
  )

  const {
    isValid: isPaymentSectionValid,
    isDisabled: isPaymentSectionDisabled,
    isVisible: isPaymentSectionVisible,
    isExpanded: isPaymentSectionExpanded,
  } = useSelector((state: AppState) =>
    selectSectionStatus(state, SECTION_PAYMENT)
  )

  useEffect(() => {
    if (isPaymentSectionValid && isScrollMode) {
      dispatch(
        updateSectionStatus({
          name: SECTION_ORDER_SUMMARY,
          status: { isVisible: true },
        })
      )
    }

    if (isPaymentSectionDisabled || !isPaymentSectionValid) {
      dispatch(
        updateSectionStatus({
          name: SECTION_ORDER_SUMMARY,
          status: { isVisible: false },
        })
      )
    }
  }, [isPaymentSectionValid, isPaymentSectionDisabled, isPaymentSectionVisible])

  useEffect(() => {
    if (isScreensMode) {
      if (isPaymentSectionExpanded || !isPaymentSectionVisible) {
        dispatch(
          updateSectionStatus({
            name: SECTION_ORDER_SUMMARY,
            status: { isVisible: false },
          })
        )
      }
    }
  }, [isPaymentSectionExpanded, isPaymentSectionVisible])

  useEffect(() => {
    return () => {
      dispatch(
        updateSectionStatus({
          name: SECTION_ORDER_SUMMARY,
          status: { isVisible: false },
        })
      )
    }
  }, [])

  if (!isVisibleSection) {
    return null
  }

  return <OrderSummaryContentLazy />
}

export default OrderSummary
