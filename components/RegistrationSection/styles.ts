import { SxProps } from '@mui/material'
import { grey } from '@mui/material/colors'

const footer: SxProps = (isCookiesConsent) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 24px',
  borderTop: `1px solid ${grey[400]}`,
  background: grey[50],
  position: 'fixed',
  bottom: isCookiesConsent ? 0 : 108,
  zIndex: 1,
  width: '100%',
  maxWidth: '1000px',
  left: '50%',
  transform: 'translateX(-50%)',
  height: '67px',
})

const nextButton: SxProps = {
  padding: '8px 22px',
  fontSize: '15px',
  textTransform: 'uppercase',
}

export const styles = {
  footer,
  nextButton,
}
