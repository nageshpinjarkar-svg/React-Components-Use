import { SxProps, Theme } from '@mui/material'
import { grey } from '@mui/material/colors'

import { darkBlue } from 'src/styles/includes/_colors'
import { THEME_MODE_DARK } from 'src/styles/themes/styles'

const paperWrapper: SxProps = (theme: Theme) => ({
  backgroundColor:
    theme.palette.mode === THEME_MODE_DARK ? darkBlue : grey[100],
  height: '100%',
  display: 'flex',
  flexFlow: 'column',
  minHeight: '100vh',
  background:
    'linear-gradient(to right, #f5f5f5 0, #f5f5f5 calc(50% - 500px), transparent calc(50% - 500px), transparent calc(50% + 500px), #f5f5f5 calc(50% + 500px), #f5f5f5 100%); /* Define the background with 3 sections */',
  backgroundRepeat: 'no-repeat',
})

const paper = (isFooterVisible): SxProps => ({
  margin: '0 auto',
  maxWidth: '1000px',
  width: '100%',
  borderRadius: 0,
  boxShadow: 'none',
  paddingBottom: isFooterVisible ? '67px' : 0,
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',

  flex: '1 1 auto',
})

const paperContent: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}

export const styles = {
  paper,
  paperWrapper,
  paperContent,
}
