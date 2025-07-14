import { Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { UseFormWatch } from 'react-hook-form'

import {
  ControlledChronoTextField,
  ControlledChronoSelect,
  ControlledChronoCheckbox,
} from 'src/components/shared'
import { countryOptions, regionOptions } from 'src/features/shared/data'
import { AutoFillFields } from 'src/types/general'

import { CardPaymentFormValuesType } from './types'

interface BillingAddressFormProps {
  watch: UseFormWatch<CardPaymentFormValuesType>
}

const BillingAddressForm = ({ watch }: BillingAddressFormProps) => {
  const { t } = useTranslation()
  const isFirstEntryAddr = watch('cardPayment.meta.isFirstEntryAddr')

  const billingAddressCountry = watch('cardPayment.address.country')
  const regionOptionsData = useMemo(
    () => regionOptions(billingAddressCountry),
    [billingAddressCountry]
  )

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12}>
        <Typography paddingTop={'28px'}>{t('billingAddress')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <ControlledChronoCheckbox
          label={t('useSameAddress')}
          name="cardPayment.meta.isFirstEntryAddr"
        />
      </Grid>

      {!isFirstEntryAddr && (
        <>
          <Grid item xs={12} sx={{ paddingTop: '30px' }}>
            <Typography>{t('address')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <ControlledChronoTextField
              name="cardPayment.address.street"
              label={t('streetAddress')}
              autoComplete={AutoFillFields.streetAddress1}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledChronoTextField
              name="cardPayment.address.street2"
              label={t('streetAddress2')}
              autoComplete={AutoFillFields.streetAddress2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ControlledChronoSelect
              label={t('country')}
              options={countryOptions}
              name="cardPayment.address.country"
              autoComplete={AutoFillFields.country}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ControlledChronoSelect
              label={t('stateRegion')}
              options={regionOptionsData}
              name="cardPayment.address.state"
              autoComplete={AutoFillFields.state}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ControlledChronoTextField
              name="cardPayment.address.postalCode"
              label={t('postalCode')}
              autoComplete={AutoFillFields.postalCode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ControlledChronoTextField
              name="cardPayment.address.city"
              label={t('city')}
              autoComplete={AutoFillFields.city}
            />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default BillingAddressForm
