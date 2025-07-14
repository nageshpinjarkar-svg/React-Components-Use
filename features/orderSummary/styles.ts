import { SxProps } from '@mui/material'
import { grey } from '@mui/material/colors'

const orderItem: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
  color: grey[800],
}

const completeRegistrationButton = {
  color: 'white',
  fontSize: '15px',
  width: 'initial',
  padding: '8px 22px',
  flex: 'none',
}

const total = {
  fontWeight: '700',
  fontSize: '20px',
}

const additionalInfo = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  flexWrap: {
    xs: 'wrap',
    sm: 'nowrap',
  },

  '& p': {
    marginBottom: '4px',
    fontSize: '12px',
    color: grey[700],
  },
}

const orderSummaryBox = {
  marginTop: '130px',
  padding: '24px',
  bottom: 0,
  maxWidth: '1000px',
  width: '100%',
  backgroundColor: grey[50],
  border: `1px solid ${grey[400]}`,
  borderRadius: '4px',
}

export const styles = {
  orderItem,
  completeRegistrationButton,

  additionalInfo,
  orderSummaryBox,
  total,
}
