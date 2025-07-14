import { Box, Typography, Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'

import RenderPriceOrLoader from 'src/components/shared/RenderPriceOrLoader'

import { styles } from './styles'
import { OrderSummaryData } from './orderSummarySlice'

const FeeTaxList = ({
  feeAndTaxData,
  isLoading,
}: {
  feeAndTaxData: OrderSummaryData
  isLoading: boolean
}) => {
  const { t } = useTranslation()

  return (
    <>
      {!!feeAndTaxData.customFees?.length &&
        feeAndTaxData.customFees.map((item) => (
          <Box key={item.name} sx={styles.orderItem}>
            <Typography>{item.name}</Typography>
            <Typography>
              <RenderPriceOrLoader value={item.fee} isLoading={isLoading} />
            </Typography>
          </Box>
        ))}
      <Box sx={styles.orderItem}>
        <Typography>{t('serviceFee')}</Typography>
        <Typography>
          <RenderPriceOrLoader
            value={feeAndTaxData.totalServiceFee}
            isLoading={isLoading}
          />
        </Typography>
      </Box>
      <Box sx={styles.orderItem}>
        <Typography>{t('salesTax')}</Typography>
        <Typography>
          <RenderPriceOrLoader
            value={feeAndTaxData.totalSalesTax}
            isLoading={isLoading}
          />
        </Typography>
      </Box>
      <Divider sx={{ mt: '8px', mb: '15px' }} />
    </>
  )
}

export default FeeTaxList
