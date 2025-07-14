import { SxProps } from '@mui/material'

import { PolicyUxMode } from 'src/features/policy/types'
import { SCREENS_MODE } from 'src/features/policy/constants'

const cardNumFieldImg: SxProps = {
  width: '50px',
  height: '25px',
}

const billingAddress: SxProps = {
  fontWeight: 'bold',
}

export const cardImage = {
  width: '50px',
  height: '25px',
}

const paymentBox = {
  paddingX: 2,
}

const paymentOptions = {
  paddingTop: '0px !important',
}

const entriesSubtotalText: SxProps = (uxMode: PolicyUxMode) => ({
  paddingLeft: 1,
  marginTop: uxMode === SCREENS_MODE ? 4 : 0,
  paddingBottom: uxMode === SCREENS_MODE ? 2 : 4,
})

export const styles = {
  cardNumFieldImg,
  billingAddress,
  cardImage,
  paymentBox,
  paymentOptions,
  entriesSubtotalText,
}
