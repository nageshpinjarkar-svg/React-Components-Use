import { Box, Divider, Link, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { selectPaymentType } from 'src/features/payment/paymentSlice'
import { useGetRegistrationEventByIdQuery } from 'src/api/event'
import { PAYMENT_TYPE_CASH } from 'src/features/payment/types'
import RenderPriceOrLoader from 'src/components/shared/RenderPriceOrLoader'

import { selectEntries } from '../entries/entriesSlice'

const CompleteRegistrationButtonLazy = dynamic(() =>
  import('./CompleteRegistrationButton').then((mod) => mod.default)
)

import FeeTaxList from './FeeTaxList'
import RegistrationList from './ParticipantList'
import { styles } from './styles'
import {
  OrderSummaryStatus,
  selectIsTotalAmountZero,
  selectOrderSummary,
  selectOrderSummaryStatus,
} from './orderSummarySlice'

const OrderSummaryContent = () => {
  const { t } = useTranslation()
  const { registrations: participantsList } = useSelector(selectEntries)
  const paymentType = useSelector(selectPaymentType)
  const orderSummary = useSelector(selectOrderSummary)
  const orderSummaryStatus = useSelector(selectOrderSummaryStatus)
  const { query } = useRouter()
  const { data } = useGetRegistrationEventByIdQuery(Number(query.eventId))

  const firstRegistrationsEmail = participantsList[0].details.email
  const isCashPaymentOption = paymentType === PAYMENT_TYPE_CASH
  const isLoading = orderSummaryStatus === OrderSummaryStatus.Loading
  const isTotalAmountZero = useSelector(selectIsTotalAmountZero)

  const eventName = data?.name

  return (
    <Box sx={styles.orderSummaryBox}>
      <Typography sx={{ fontSize: '24px', mb: '15px' }}>
        {t('orderSummary')}
      </Typography>

      <RegistrationList
        participantList={participantsList}
        isLoading={isLoading}
      />
      <Box sx={styles.orderItem}>
        <Typography sx={{ fontWeight: 'bold' }}>
          {t('subtotal', { items: participantsList.length })}
        </Typography>
        <Typography sx={{ fontWeight: 'bold' }}>
          <RenderPriceOrLoader
            value={orderSummary?.totalPrice}
            isLoading={isLoading}
          />
        </Typography>
      </Box>

      <Divider sx={{ mt: '8px', mb: '15px' }} />

      <FeeTaxList feeAndTaxData={orderSummary} isLoading={isLoading} />

      <Box sx={styles.orderItem}>
        <Typography sx={styles.total}>{t('total')}</Typography>
        <Typography variant="h5" sx={styles.total}>
          <RenderPriceOrLoader
            value={orderSummary.total}
            isLoading={isLoading}
          />
        </Typography>
      </Box>

      <Divider sx={{ mt: '8px', mb: '12px' }} />

      <Box sx={styles.additionalInfo}>
        <Box>
          <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
            {t('emailedTo')} {firstRegistrationsEmail}
          </Typography>

          {!isCashPaymentOption && !isTotalAmountZero && (
            <Typography>{t('chargeWillAppear', { eventName })}</Typography>
          )}

          <Typography>
            {t('termsPolicy')}{' '}
            <Link href="https://www.example.com/terms" target="_blank">
              {t('terms')}
            </Link>{' '}
            {t('and')}{' '}
            <Link href="https://www.example.com/privacy" target="_blank">
              {t('privacyPolicy')}
            </Link>
          </Typography>
        </Box>
        <CompleteRegistrationButtonLazy />
      </Box>
    </Box>
  )
}

export default OrderSummaryContent
