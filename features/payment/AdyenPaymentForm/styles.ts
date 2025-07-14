import { SxProps, Theme } from '@mui/material'

const container: SxProps = {
  marginTop: '16px',
  position: 'relative',
}

const errorText: SxProps = {
  margin: '3px 14px 0',
}

const field: SxProps = {
  height: '40px',
  padding: '8px 14px',
  width: '100%',
  borderRadius: '4px',
  transition: 'border-color 0.2s',
}

const adyenFormFieldLabel = (theme: Theme) => ({
  position: 'absolute',
  fontSize: '12px',
  top: -7,
  left: 9,
  background: theme.palette.background.paper,
  padding: '0 5px',
  textAlign: 'center',
})

export const styles = {
  container,
  errorText,
  field,
  adyenFormFieldLabel,
}
