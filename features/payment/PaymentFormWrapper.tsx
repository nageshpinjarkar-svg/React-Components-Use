import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'

import { selectEntries } from 'src/features/entries/entriesSlice'
import { selectEntryRegChoiceIds } from 'src/features/entries/entriesSlice'
import {
  selectSectionStatus,
  updateSectionStatus,
} from 'src/features/policy/policySlice'
import {
  QR_TYPE,
  SECTION_PAYMENT,
  SECTION_WAIVER,
  SCREENS_MODE,
} from 'src/features/policy/constants'
import { selectIsTotalAmountZero } from 'src/features/orderSummary/orderSummarySlice'
import { AppState } from 'src/app/store'
import { useGetRegistrationEventByIdQuery } from 'src/api/event'

import { useGetPolicyType, useGetUxMode } from '../shared/hooks'

import { useCardPaymentValidationSchema } from './validations/cardPaymentValidation'
import PaymentForm from './PaymentForm'
import {
  CardPaymentFormValuesType,
  PAYMENT_TYPE_CARD,
  PAYMENT_TYPE_CASH,
} from './types'
import {
  selectPaymentType,
  updateBillingAddress,
  updateCard,
  updatePaymentMethod,
} from './paymentSlice'
import { styles } from './styles/cardStyles'

export const defaultCardValues = {
  checkoutAttemptId: '',
  encryptedCardNumber: '',
  encryptedExpiryMonth: '',
  encryptedExpiryYear: '',
  encryptedSecurityCode: '',
  type: '',
}

const defaultAddressValue = {
  city: '',
  country: '',
  postalCode: '',
  state: '',
  street: '',
  street2: '',
}

const PaymentFormWrapper = () => {
  const dispatch = useDispatch()
  const { registrations } = useSelector(selectEntries)
  const uxMode = useGetUxMode()
  const isScreenMode = uxMode === SCREENS_MODE
  const isTotalAmountZero = useSelector(selectIsTotalAmountZero)

  const { query } = useRouter()
  const { data } = useGetRegistrationEventByIdQuery(Number(query.eventId))
  const regChoiceIds = useSelector(selectEntryRegChoiceIds).join('-')
  const policyType = useGetPolicyType()
  const paymentType = useSelector(selectPaymentType)

  const { isValid: isWaiverSectionValid } = useSelector((state: AppState) =>
    selectSectionStatus(state, SECTION_WAIVER)
  )

  useEffect(() => {
    if (isTotalAmountZero) {
      dispatch(updatePaymentMethod(PAYMENT_TYPE_CASH))
    } else if (policyType === QR_TYPE) {
      dispatch(updatePaymentMethod(PAYMENT_TYPE_CARD))
    }
  }, [])

  const defaultValues = useMemo(() => {
    const defaultAddress =
      registrations.length && registrations[0].address
        ? registrations[0].address
        : defaultAddressValue

    return {
      card: defaultCardValues,
      holderName: '',
      address: defaultAddress,
      meta: {
        paymentType,
        isFirstEntryAddr: true,
      },
    }
  }, [registrations, paymentType])

  const validationSchema = useCardPaymentValidationSchema(
    isTotalAmountZero,
    data?.paymentProcessor
  )

  const methods = useForm<CardPaymentFormValuesType>({
    defaultValues: { cardPayment: defaultValues },
    values: { cardPayment: defaultValues },
    mode: 'onTouched',
    resolver: yupResolver(validationSchema),
  })

  const {
    formState: { isValid },
    watch,
    setValue,
  } = methods

  const { holderName, card, address } = watch().cardPayment

  useEffect(() => {
    dispatch(updateCard(isValid ? { ...card, holderName } : null))
  }, [holderName, card, isValid, dispatch])

  useEffect(() => {
    if (isValid) {
      dispatch(updateBillingAddress({ ...address }))
    }
  }, [isValid, ...Object.values(address)])

  useEffect(() => {
    dispatch(
      updateSectionStatus({
        name: SECTION_PAYMENT,
        status: { isValid: isValid },
      })
    )
  }, [isValid])

  useEffect(() => {
    if (paymentType === null) {
      return
    }

    if (isWaiverSectionValid || isScreenMode) {
      dispatch(
        updateSectionStatus({ name: SECTION_PAYMENT, status: { isValid } })
      )
    }
  }, [isValid, isScreenMode])

  useEffect(() => {
    setValue('cardPayment', defaultValues)
  }, [regChoiceIds])

  return (
    <Box
      {...(isScreenMode && {
        sx: styles.paymentBox,
      })}
    >
      <FormProvider {...methods}>
        <PaymentForm
          setValue={setValue}
          watch={watch}
          isTotalAmountZero={isTotalAmountZero}
        />
      </FormProvider>
    </Box>
  )
}

export default PaymentFormWrapper
