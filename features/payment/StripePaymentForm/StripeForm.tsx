import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, FormHelperText, Grid, Typography, useTheme } from '@mui/material'
import {
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
} from '@stripe/stripe-js'
import { useFormContext } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import { ControlledChronoTextField } from 'src/components/shared'
import { AutoFillFields } from 'src/types/general'
import { updateStripeCardToken } from 'src/features/payment/paymentSlice'

import { styles } from './styles'

const StripeForm = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const elements = useElements()
  const stripe = useStripe()
  const dispatch = useDispatch()
  const { setValue, getValues } = useFormContext()
  const values = getValues()

  const areAllCardFieldCompleted =
    values.cardPayment.card.cardNumber &&
    values.cardPayment.card.cardExpiry &&
    values.cardPayment.card.cardCvc

  const options = {
    ...styles.stripeStyles(theme),
  }

  const [fieldErrors, setFieldErrors] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  })

  const handleChangePaymentFields = (
    paymentElement:
      | StripeCardNumberElementChangeEvent
      | StripeCardExpiryElementChangeEvent
      | StripeCardCvcElementChangeEvent
  ) => {
    const updatePaymentElement = (value: boolean) => {
      setValue(`cardPayment.card.${paymentElement.elementType}`, value, {
        shouldValidate: true,
      })
    }

    if (paymentElement?.error) {
      setFieldErrors((prev) => ({
        ...prev,
        [paymentElement.elementType]: paymentElement?.error?.message || '',
      }))
      updatePaymentElement(false)
    }

    if (paymentElement.complete) {
      updatePaymentElement(true)
      setFieldErrors((prev) => ({ ...prev, [paymentElement.elementType]: '' }))
    } else {
      updatePaymentElement(false)
    }
  }

  const CARD_NUMBER = 'cardNumber'
  const CARD_EXPIRY = 'cardExpiry'
  const CARD_CVC = 'cardCvc'

  const cardFields = [
    {
      component: CardNumberElement,
      translation: t('cardNumber'),
      error: fieldErrors[CARD_NUMBER],
    },
    {
      component: CardExpiryElement,
      translation: t('expiryDate'),
      error: fieldErrors[CARD_EXPIRY],
    },
    {
      component: CardCvcElement,
      translation: t('cvvOrCvc'),
      error: fieldErrors[CARD_CVC],
    },
  ]

  useEffect(() => {
    if (!(areAllCardFieldCompleted && elements && stripe)) return
    const cardNumberElement = elements.getElement(CardNumberElement)
    if (!cardNumberElement) return
    stripe.createToken(cardNumberElement).then((res) => {
      dispatch(updateStripeCardToken(res.token!.id))
    })
  }, [areAllCardFieldCompleted, stripe, elements])

  const generateCardField = (
    { component: CardField, translation, error },
    options
  ) => (
    <Grid item xs={12} key={translation} sx={styles.container}>
      <Box
        sx={{
          ...styles.field,
          border: fieldErrors.cardNumber
            ? '2px solid red'
            : '1px solid #cfcfcf',
        }}
        tabIndex={-1}
      >
        <Typography
          sx={styles.formFieldLabel}
          color={fieldErrors.cardNumber ? 'red' : undefined}
        >
          {translation}
        </Typography>
        <CardField options={options} onChange={handleChangePaymentFields} />
      </Box>

      {error && (
        <FormHelperText error sx={styles.errorText}>
          {error}
        </FormHelperText>
      )}
    </Grid>
  )

  return (
    <Grid item container xs={12}>
      {cardFields.map((cardField) => generateCardField(cardField, options))}
      <Grid item xs={12} sx={styles.container}>
        <ControlledChronoTextField
          label={t('nameOnCard')}
          InputLabelProps={{ shrink: true }}
          placeholder="S. Hopper"
          name="cardPayment.holderName"
          autoComplete={AutoFillFields.ccName}
        />
      </Grid>
    </Grid>
  )
}

export default StripeForm
