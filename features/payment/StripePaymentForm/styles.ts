import { SxProps, Theme } from '@mui/material'
import { grey } from '@mui/material/colors'

import { THEME_MODE_DARK } from 'src/styles/themes/styles'

const container: SxProps = {
  marginTop: '16px',
  position: 'relative',
}

const errorText: SxProps = {
  margin: '3px 14px 0',
}

const field: SxProps = {
  height: '40px',
  padding: '12px 14px',
  width: '100%',
  borderRadius: '4px',
  transition: 'border-color 0.2s',
}

const formFieldLabel = (theme: Theme) => ({
  position: 'absolute',
  fontSize: '12px',
  top: -7,
  left: 9,
  background: theme.palette.background.paper,
  padding: '0 5px',
  textAlign: 'center',
})

export const stripeStyles = (theme: Theme) => ({
  style: {
    base: {
      color: theme.palette.mode === THEME_MODE_DARK ? 'white' : 'black',
      fontSize: '16px',
      '::placeholder': {
        color: grey[400],
      },
    },
  },
})

export const styles = {
  stripeStyles,
  container,
  errorText,
  field,
  formFieldLabel,
}
