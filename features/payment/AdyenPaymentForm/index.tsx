import '@adyen/adyen-web/dist/adyen.css'
import AdyenCheckout from '@adyen/adyen-web'
import { CoreOptions } from '@adyen/adyen-web/dist/types/core/types'
import { Grid, Box, FormHelperText, Typography } from '@mui/material'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { grey } from '@mui/material/colors'

import { ControlledChronoTextField } from 'src/components/shared'

import {
  AdyenBrowserInfo,
  AdyenEncryptedPaymentMethod,
  CardPaymentFormValues,
} from '../types'
import { AutoFillFields } from '../../../types/general'
import { updateBrowserInfo } from '../paymentSlice'

import { styles } from './styles'

enum CardParts {
  CardNumber = 'encryptedCardNumber',
  ExpiryMonth = 'encryptedExpiryMonth',
  ExpiryYear = 'encryptedExpiryYear',
  SecurityCode = 'encryptedSecurityCode',
}

enum FieldType {
  CardNumber = 'encryptedCardNumber',
  ExpiryDate = 'encryptedExpiryDate',
  SecurityCode = 'encryptedSecurityCode',
}

type FieldErrors = { [key in FieldType]?: string | null }

type AdyenState = {
  data: {
    paymentMethod: AdyenEncryptedPaymentMethod
    browserInfo: AdyenBrowserInfo
  }
  errors: { [key in FieldType]?: { errorI18n: string } | null }
  isValid: boolean
  valid: {
    [key in CardParts]: boolean
  }
}

const AdyenPaymentForm = () => {
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { setValue, formState, trigger, getValues } =
    useFormContext<CardPaymentFormValues<AdyenEncryptedPaymentMethod>>()

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const onAutoComplete = useCallback(
    (data: { name: string; value: string }) => {
      const formHolderName = getValues('cardPayment.holderName')

      const holderNameAutoCompleted = data.name === AutoFillFields.ccName
      const holderNameCanBeUpdated = data.value !== formHolderName

      if (holderNameAutoCompleted && holderNameCanBeUpdated)
        setValue('cardPayment.holderName', data.value)
    },
    [getValues, setValue]
  )

  const onFocus = useCallback(
    (event: { fieldType: FieldType; focus: boolean }) => {
      const { fieldType, focus } = event

      if (!focus) {
        trigger(
          fieldType === FieldType.ExpiryDate
            ? 'cardPayment.card.encryptedExpiryMonth'
            : `cardPayment.card.${fieldType}`
        )
      }
    },
    [trigger]
  )

  const onChange = useCallback(
    (state: AdyenState) => {
      const { data, errors, isValid, valid } = state

      dispatch(updateBrowserInfo(data.browserInfo))

      const errorKeys = Object.keys(errors)

      if (!isValid && !errorKeys.length) {
        return
      }

      const newErrors = errorKeys.reduce(
        (acc: FieldErrors, curr) => ({
          ...acc,
          [curr]: errors[curr]?.errorI18n,
        }),
        {}
      )

      setFieldErrors((prev) => ({ ...prev, ...newErrors }))

      if (isValid) {
        setValue('cardPayment.card', data.paymentMethod, {
          shouldValidate: true,
        })
      } else {
        Object.values(CardParts).forEach((cardPart) => {
          setValue(
            `cardPayment.card.${cardPart}`,
            data.paymentMethod[cardPart] || '',
            { shouldValidate: valid[cardPart] }
          )
        })
      }
    },
    [setValue]
  )

  const cardFields = useMemo(
    () => [
      {
        label: `${t('cardNumber')}`,
        name: FieldType.CardNumber,
      },
      {
        label: `${t('expiryDate')}`,
        name: FieldType.ExpiryDate,
      },
      {
        label: `${t('cvvOrCvc')}`,
        name: FieldType.SecurityCode,
      },
    ],
    [t]
  )

  const formErrors = useMemo(() => {
    const formErrors = formState.errors.cardPayment?.card

    return {
      [FieldType.CardNumber]:
        fieldErrors.encryptedCardNumber ||
        formErrors?.encryptedCardNumber?.message,
      [FieldType.ExpiryDate]:
        fieldErrors.encryptedExpiryDate ||
        formErrors?.encryptedExpiryMonth?.message,
      [FieldType.SecurityCode]:
        fieldErrors.encryptedSecurityCode ||
        formErrors?.encryptedSecurityCode?.message,
    }
  }, [fieldErrors, formState])

  const prepareAdyenCheckout = async () => {
    const configuration: CoreOptions = {
      locale: 'en_US',
      environment: process.env.NEXT_PUBLIC_ADYEN_ENV,
      clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
    }
    const checkoutOptions = {
      type: 'card',
      brands: ['visa', 'amex', 'mc'],
      styles: {
        base: {
          fontWeight: 400,
          fontFamily: 'Roboto, Helvetica,Arial,sans-serif',
        },
        validated: {
          color: 'green',
        },
        placeholder: {
          color: grey[400],
          fontWeight: 400,
        },
      },
    }

    try {
      const checkout = await AdyenCheckout(configuration)

      const createdCheckout = checkout.create('securedfields', {
        ...checkoutOptions,
        onAutoComplete,
        onChange,
        onFocus,
        // Only for Web Components before 4.0.0.
        // For Web Components 4.0.0 and above, configure aria-label attributes in translation files
        ariaLabels: {
          lang: 'en-GB',
          encryptedCardNumber: {
            label: 'Credit or debit card number field',
            iframeTitle: 'Iframe for secured card number',
            error:
              'Message that gets read out when the field is in the error state',
          },
        },
      })

      if (ref.current) {
        createdCheckout.mount(ref.current)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    prepareAdyenCheckout()
  }, [])

  return (
    <Grid item container xs={12} ref={ref}>
      {cardFields.map(({ name, label }) => (
        <Grid item xs={12} sx={styles.container} key={name}>
          <Box
            data-cse={name}
            sx={styles.field}
            border={formErrors[name] ? '2px solid red' : '1px solid #cfcfcf'}
            tabIndex={-1}
          >
            <Typography
              sx={styles.adyenFormFieldLabel}
              color={formErrors[name] ? 'red' : undefined}
            >
              {label}
            </Typography>
          </Box>

          {formErrors[name] && (
            <FormHelperText error sx={styles.errorText}>
              {formErrors[name]}
            </FormHelperText>
          )}
        </Grid>
      ))}

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

export default AdyenPaymentForm
