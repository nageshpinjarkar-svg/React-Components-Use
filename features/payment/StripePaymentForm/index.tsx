import { useSelector } from 'react-redux'
import { Box } from '@mui/material'

import { selectOrderSummaryTotal } from '../../orderSummary/orderSummarySlice'

import StripeForm from './StripeForm'

const StripePaymentForm = () => {
  const total = useSelector(selectOrderSummaryTotal)

  return (
    <Box sx={{ width: '100%' }}>
      {!!total && Number(total) && <StripeForm />}
    </Box>
  )
}

export default StripePaymentForm
