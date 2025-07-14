import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { EventPaymentProcessor } from 'src/api/event/types'
import { AdyenEncryptedPaymentMethod } from 'src/features/payment/AdyenPaymentForm/types'
import { isStripeProcessor } from 'src/features/shared/utils'

import {
  CardPaymentModel,
  PaymentType,
  PAYMENT_TYPE_CASH,
  StripePaymentData,
  CardPaymentFormValuesType,
} from '../types'

export const useCardPaymentValidationSchema = (
  isTotalAmountZero: boolean,
  paymentProcessor: EventPaymentProcessor = EventPaymentProcessor.Adyen
) => {
  const { t } = useTranslation()

  const skipPaymentValidation = (paymentType) => {
    return paymentType === PAYMENT_TYPE_CASH || isTotalAmountZero
  }

  const cardPaymentValidationSlice = useMemo(
    () =>
      Yup.object({
        address: Yup.object().when(
          'meta.paymentType',
          (paymentType: PaymentType[]) => {
            if (skipPaymentValidation(paymentType[0])) {
              return Yup.object()
            }
            return Yup.object({
              city: Yup.string(),
              country: Yup.string(),
              postalCode: Yup.string().required(t('requiredField')),
              state: Yup.string(),
              street: Yup.string(),
              street2: Yup.string(),
            })
          }
        ) as Yup.ObjectSchema<CardPaymentModel<StripePaymentData>['address']>,
        holderName: Yup.string().when(
          'meta.paymentType',
          (paymentType: PaymentType[]) => {
            if (skipPaymentValidation(paymentType[0])) {
              return Yup.string()
            }

            return Yup.string().trim().required(t('requiredField'))
          }
        ) as Yup.StringSchema<
          CardPaymentModel<StripePaymentData>['holderName']
        >,
        card: Yup.object().when(
          'meta.paymentType',
          (paymentType: PaymentType[]) => {
            if (skipPaymentValidation(paymentType[0])) {
              return Yup.object()
            }
            if (isStripeProcessor(paymentProcessor)) {
              return Yup.object({
                cardNumber: Yup.boolean().isTrue().required(t('requiredField')),
                cardExpiry: Yup.boolean().isTrue().required(t('requiredField')),
                cardCvc: Yup.boolean().isTrue().required(t('requiredField')),
              }) as Yup.ObjectSchema<StripePaymentData>
            } else {
              return Yup.object({
                encryptedCardNumber: Yup.string().required(t('requiredField')),
                encryptedExpiryMonth: Yup.string().required(t('requiredField')),
                encryptedSecurityCode: Yup.string().required(
                  t('requiredField')
                ),
              })
            }
          }
        ) as Yup.ObjectSchema<AdyenEncryptedPaymentMethod>,
        meta: Yup.object({
          paymentType: Yup.string<PaymentType>().nullable().defined(),
          isFirstEntryAddr: Yup.boolean().required(),
        }),
      }),
    [t, isTotalAmountZero]
  )

  const validationSchema = useMemo<Yup.ObjectSchema<CardPaymentFormValuesType>>(
    () =>
      Yup.object({
        cardPayment: cardPaymentValidationSlice.required(),
      }),
    [cardPaymentValidationSlice, isTotalAmountZero]
  )

  return validationSchema
}
