import { useDispatch, useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useMemo } from 'react'

import {
  selectSectionStatus,
  updateSectionStatus,
} from 'src/features/policy/policySlice'
import {
  SECTION_ORDER_SUMMARY,
  SECTION_PAYMENT,
  SECTION_WAIVER,
} from 'src/features/policy/constants'
import { AppState } from 'src/app/store'
import ScreenSectionWrapper from 'src/components/shared/ScreenSectionWrapper'
import RegistrationAccordion from 'src/components/shared/RegistrationAccordion'

import { useExpandCollapseSection, useGetCurrentUxMode } from '../shared/hooks'
import { selectIsTotalAmountZero } from '../orderSummary/orderSummarySlice'

import { selectPaymentType } from './paymentSlice'
import { PAYMENT_TYPE_CARD } from './types'

const PaymentComponentLazy = dynamic(() =>
  import('src/features/payment/PaymentFormWrapper').then((mod) => mod.default)
)

const Payment = () => {
  const { t } = useTranslation()
  const { isScreensMode } = useGetCurrentUxMode()
  const dispatch = useDispatch()
  const isTotalAmountZero = useSelector(selectIsTotalAmountZero)

  const paymentType = useSelector(selectPaymentType)

  const { isSectionExpanded, setIsSectionExpanded } =
    useExpandCollapseSection(SECTION_PAYMENT)

  const {
    isValid: isWaiverSectionValid,
    isDisabled: isWaiverSectionDisabled,
    isVisible: isWaiverSectionVisible,
    isExpanded: isWaiverSectionExpanded,
  } = useSelector((state: AppState) =>
    selectSectionStatus(state, SECTION_WAIVER)
  )

  const {
    isValid: isSectionValid,
    isDisabled: isSectionDisabled,
    isVisible: isSectionVisible,
  } = useSelector((state: AppState) =>
    selectSectionStatus(state, SECTION_PAYMENT)
  )

  useEffect(() => {
    if (isWaiverSectionValid) {
      dispatch(
        updateSectionStatus({
          name: SECTION_PAYMENT,
          status: { isExpanded: true, isDisabled: false },
        })
      )
    }

    if (isWaiverSectionDisabled || !isWaiverSectionValid) {
      dispatch(
        updateSectionStatus({
          name: SECTION_PAYMENT,
          status: { isExpanded: false, isDisabled: true, isValid: false },
        })
      )
    }
  }, [isWaiverSectionValid, isWaiverSectionDisabled])

  useEffect(() => {
    if (isScreensMode) {
      if (isWaiverSectionExpanded || !isWaiverSectionVisible) {
        dispatch(
          updateSectionStatus({
            name: SECTION_PAYMENT,
            status: { isVisible: false },
          })
        )
      }
    }
  }, [isWaiverSectionExpanded, isWaiverSectionVisible])

  const handleAccordionSummaryClick = useCallback(() => {
    setIsSectionExpanded(!isSectionExpanded)
  }, [isSectionExpanded])

  const getSectionSubTitle = useMemo(() => {
    if (!isSectionValid || !paymentType || isTotalAmountZero) {
      return ''
    }

    return paymentType === PAYMENT_TYPE_CARD ? t('creditCard') : t('cash')
  }, [isSectionValid, paymentType, isTotalAmountZero])

  if (!isSectionVisible && isScreensMode) {
    return null
  }

  return (
    <ScreenSectionWrapper
      isNextDisabled={!isSectionValid}
      onClickNext={() => {
        dispatch(
          updateSectionStatus({
            name: SECTION_PAYMENT,
            status: { isExpanded: false },
          })
        )
        dispatch(
          updateSectionStatus({
            name: SECTION_ORDER_SUMMARY,
            status: { isVisible: true },
          })
        )
      }}
    >
      <RegistrationAccordion
        title={t('payment')}
        subTitle={getSectionSubTitle}
        isAccordionExpanded={!!isSectionExpanded}
        isAccordionDisabled={!!isSectionDisabled}
        setIsAccordionExpanded={setIsSectionExpanded}
        handleAccordionSummaryClick={handleAccordionSummaryClick}
      >
        {!isSectionDisabled && <PaymentComponentLazy />}
      </RegistrationAccordion>
    </ScreenSectionWrapper>
  )
}

export default Payment
