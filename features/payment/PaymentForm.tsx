import { Grid, Typography, CircularProgress, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { useMemo, useEffect } from 'react'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { isStripeProcessor } from 'src/features/shared/utils'
import { ControlledChronoRadioGroup } from 'src/components/shared'
import { updateSectionStatus } from 'src/features/policy/policySlice'
import { KIOSK_TYPE, SECTION_PAYMENT } from 'src/features/policy/constants'
import { useGetPolicyType } from 'src/features/shared/hooks'
import {
  OrderSummaryStatus,
  selectOrderSummaryStatus,
} from 'src/features/orderSummary/orderSummarySlice'
import { useGetRegistrationEventByIdQuery } from 'src/api/event'
import StripePaymentForm from 'src/features/payment/StripePaymentForm'

import AdyenPaymentForm from './AdyenPaymentForm'
import BillingAddressForm from './BillingAddressForm'
import { styles } from './styles/cardStyles'
import {
  CardPaymentFormValuesType,
  PAYMENT_TYPE_CARD,
  PAYMENT_TYPE_CASH,
  PaymentType,
} from './types'
import { selectPaymentType, updatePaymentMethod } from './paymentSlice'
import { defaultCardValues } from './PaymentFormWrapper'

const CARD_IMAGE_MASTER = '/img/mastercard.svg'
const CARD_IMAGE_VISA = '/img/visa.svg'
const CARD_IMAGE_AMEX = '/img/amex.svg'

interface CardPaymentFormProp {
  isTotalAmountZero: boolean
  watch: UseFormWatch<CardPaymentFormValuesType>
  setValue: UseFormSetValue<CardPaymentFormValuesType>
}

const PaymentForm = ({
  isTotalAmountZero,
  watch,
  setValue,
}: CardPaymentFormProp) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const policyType = useGetPolicyType()
  const { query } = useRouter()

  const orderSummaryStatus = useSelector(selectOrderSummaryStatus)
  const { data } = useGetRegistrationEventByIdQuery(Number(query.eventId))
  const paymentType = useSelector(selectPaymentType)

  const isNoPaymentRequired =
    isTotalAmountZero && orderSummaryStatus === OrderSummaryStatus.Succeeded

  const isLoading = orderSummaryStatus === OrderSummaryStatus.Loading

  const paymentMethodOptions = useMemo(() => {
    const options: { label: string; value: PaymentType }[] = []

    options.push({ label: t('creditDebit'), value: PAYMENT_TYPE_CARD })

    if (policyType === KIOSK_TYPE) {
      options.push({ label: t('cash'), value: PAYMENT_TYPE_CASH })
    }

    return options
  }, [t, policyType])

  const formPaymentType = watch('cardPayment.meta.paymentType')
  useEffect(() => {
    if (formPaymentType) {
      dispatch(updatePaymentMethod(formPaymentType))
    }
  }, [formPaymentType])

  useEffect(() => {
    setValue('cardPayment.card', defaultCardValues)
    setValue('cardPayment.holderName', '')
  }, [paymentType])

  useEffect(() => {
    if (isNoPaymentRequired || paymentType === PAYMENT_TYPE_CASH) {
      dispatch(
        updateSectionStatus({
          name: SECTION_PAYMENT,
          status: { isValid: true },
        })
      )
    }
  }, [isNoPaymentRequired, paymentType])

  return (
    <>
      <Grid container>
        {isLoading && <CircularProgress size={25} />}
        {!isLoading && isNoPaymentRequired && (
          <Grid item xs={12}>
            <Typography variant="h6">{t('noPaymentIsRequired')}</Typography>
          </Grid>
        )}
        {!isLoading && !isNoPaymentRequired && (
          <>
            <Grid item xs={12} sx={styles.paymentOptions}>
              <Typography>{t('selectPaymentType')}</Typography>
              <ControlledChronoRadioGroup
                row
                name="cardPayment.meta.paymentType"
                options={paymentMethodOptions}
                required={policyType === KIOSK_TYPE}
              />
              {formPaymentType === PAYMENT_TYPE_CARD && (
                <Box sx={{ display: 'flex', marginTop: '12px' }}>
                  <Image
                    src={CARD_IMAGE_VISA}
                    {...styles.cardImage}
                    alt={t('visa')}
                  />
                  <Image
                    src={CARD_IMAGE_AMEX}
                    {...styles.cardImage}
                    alt={t('amex')}
                  />
                  <Image
                    src={CARD_IMAGE_MASTER}
                    {...styles.cardImage}
                    alt={t('mastercard')}
                  />
                </Box>
              )}
            </Grid>

            {formPaymentType === PAYMENT_TYPE_CARD && (
              <>
                {isStripeProcessor(data?.paymentProcessor) ? (
                  <StripePaymentForm />
                ) : (
                  <AdyenPaymentForm />
                )}

                <BillingAddressForm watch={watch} />
              </>
            )}
          </>
        )}
      </Grid>
    </>
  )
}

export default PaymentForm
