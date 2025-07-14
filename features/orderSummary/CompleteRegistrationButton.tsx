import { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useElements, useStripe } from '@stripe/react-stripe-js'

import { ChronoButton } from 'src/components/shared'
import {
  useCreateAnonymousSessionMutation,
  usePostTransactionMutation,
} from 'src/api/live'
import { cacheToken } from 'src/features/session/sessionSlice'
import {
  selectPayment,
  selectStripeCardToken,
} from 'src/features/payment/paymentSlice'
import {
  SECTION_PAYMENT,
  CONFIRMATION_PAGE,
  BIB_ASSIGNMENT_PAGE,
  KIOSK_TYPE,
} from 'src/features/policy/constants'
import {
  selectEntriesValidity,
  updateReferralData,
  updateRegItem,
} from 'src/features/entries/entriesSlice'
import { useGetRegistrationEventByIdQuery } from 'src/api/event'
import { selectEntries } from 'src/features/entries/entriesSlice'
import { useGetPageNextUrl } from 'src/features/policy/hooks'
import {
  PostOrderSummaryResponse,
  RegistrationTransactionPayload,
} from 'src/api/live/types'
import { prepareRegistrationTransactionPayload } from 'src/api/live/helpers'
import ChronoSnackbar from 'src/components/shared/ChronoSnackbar'
import { AppState } from 'src/app/store'
import {
  selectSectionStatus,
  selectServerPolicyType,
} from 'src/features/policy/policySlice'
import { selectOrderSummaryTotal } from 'src/features/orderSummary/orderSummarySlice'
import { PAYMENT_TYPE_CARD } from 'src/features/payment/types'
import { isStripeProcessor } from 'src/features/shared/utils'
import { selectWaivers } from 'src/features/waiver/waiverSlice'

import { mapRawErrorToType, updateRegOptions } from './utils'
import { styles } from './styles'

const PaymentMethodType = 'card'

const CompleteRegistrationButton = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [isLoadingPaymentMethod, setIsLoadingPaymentMethod] = useState(false)
  const { registrations } = useSelector(selectEntries)
  const policyType = useSelector(selectServerPolicyType)
  const waivers = useSelector(selectWaivers)
  const stripeCardToken = useSelector(selectStripeCardToken)
  const { paymentType, card, browserInfo, billingAddress } =
    useSelector(selectPayment)
  const total = useSelector(selectOrderSummaryTotal)

  const dispatch = useDispatch()
  const stripe = useStripe()
  const elements = useElements()

  const { query, push } = useRouter()
  const { data } = useGetRegistrationEventByIdQuery(Number(query.eventId))

  const [
    createAnonymousSessionMutation,
    { isLoading: isCreatingAnonymousSessionLoading },
  ] = useCreateAnonymousSessionMutation()

  const [
    postTransactionMutation,
    { isLoading: isPostTransactionLoading, isSuccess },
  ] = usePostTransactionMutation()

  const isEntryFormValid = useSelector(selectEntriesValidity)
  const { isValid: isPaymentSectionValid } = useSelector((state: AppState) =>
    selectSectionStatus(state, SECTION_PAYMENT)
  )

  const la = router.query.la as string | undefined

  const isCompleteButtonDisabled =
    isCreatingAnonymousSessionLoading ||
    isPostTransactionLoading ||
    isLoadingPaymentMethod ||
    !isEntryFormValid ||
    !isPaymentSectionValid ||
    isSuccess

  const transformErrorMessage = (errorMessage: string) => {
    if (!errorMessage) {
      return t('unexpectedCardError')
    }

    const rawErrorMessage = errorMessage.split(':')[1]?.trim()
    const errorType =
      mapRawErrorToType[rawErrorMessage] ||
      errorMessage ||
      'unexpectedCardError'

    return t(errorType)
  }

  const nextPage =
    query.type === KIOSK_TYPE ? BIB_ASSIGNMENT_PAGE : CONFIRMATION_PAGE
  const nextPageUrl = useGetPageNextUrl(nextPage)

  const onCompleteRegistration = useCallback(() => {
    if (!data) {
      return
    }

    createAnonymousSessionMutation()
      .unwrap()
      .then((tokenData) => {
        dispatch(cacheToken(tokenData.token))
      })
      .then(async () => {
        if (
          isStripeProcessor(data.paymentProcessor) &&
          !!total &&
          Number(total) &&
          paymentType === PAYMENT_TYPE_CARD
        ) {
          setIsLoadingPaymentMethod(true)
          const elementsRes = await elements?.submit()
          if (elementsRes?.error) {
            ChronoSnackbar.enqueueMessage(
              elementsRes.error.message || t('unexpectedErrorOccurred')
            )
            return
          }
          const { error, paymentMethod } = await stripe!.createPaymentMethod({
            type: PaymentMethodType,
            card: { token: stripeCardToken! },
            billing_details: {
              email: registrations[0].details.email,
              name: card!.holderName,
              address: {
                city: billingAddress.city,
                country: billingAddress.country,
                line1: billingAddress.street,
                line2: billingAddress.street2,
                postal_code: billingAddress.postalCode,
                state: billingAddress.state,
              },
            },
          })

          setIsLoadingPaymentMethod(false)
          if (error) {
            ChronoSnackbar.enqueueMessage(
              error.message || t('unexpectedErrorOccurred')
            )
            return
          }
          return paymentMethod.id
        }
      })
      .then(async (paymentMethodId?: string) => {
        const postPayload: RegistrationTransactionPayload =
          prepareRegistrationTransactionPayload(
            data,
            registrations,
            paymentType!,
            waivers,
            card,
            la,
            paymentMethodId,
            browserInfo || undefined
          )

        try {
          const response = await postTransactionMutation(postPayload).unwrap()

          if (response.entryReferralData) {
            dispatch(updateReferralData(response.entryReferralData))
          }

          return response.items.map((item, index) => ({
            ...item,
            participantId: registrations[index]?.meta?.participantId,
          }))
        } catch (e) {
          if (e.status === 409) {
            const data = e.data as unknown as PostOrderSummaryResponse

            updateRegOptions(data, dispatch, t)
          }

          return Promise.reject(e)
        }
      })
      .then((items) => {
        items.forEach((item) => {
          dispatch(
            updateRegItem({
              participantId: item.participantId,
              entryId: item.entryId,
              athleteId: item.entryId,
            })
          )
        })
        return push(nextPageUrl)
      })
      .catch((error) => {
        const errorMessage = transformErrorMessage(
          error.data?.error || error.message
        )

        ChronoSnackbar.enqueueMessage(errorMessage)
      })
      .finally(() => {
        setIsLoadingPaymentMethod(false)
      })
  }, [
    data,
    registrations,
    card,
    browserInfo,
    paymentType,
    dispatch,
    createAnonymousSessionMutation,
    postTransactionMutation,
    policyType,
    la,
    stripeCardToken,
  ])

  return (
    <ChronoButton
      title={t('completeRegistration')}
      sx={styles.completeRegistrationButton}
      fullWidth
      disabled={isCompleteButtonDisabled}
      onClick={onCompleteRegistration}
    />
  )
}

export default CompleteRegistrationButton
