import { SxProps } from '@mui/material'
import { grey } from '@mui/material/colors'

const accordionContainer: SxProps = {
  boxShadow: 'none',
  borderBottom: `1px solid ${grey[200]}`,

  '&.Mui-disabled': {
    backgroundColor: 'white',
  },
}

const summaryContainer: SxProps = {
  padding: '0px',

  '& svg': {
    fontSize: '24px',
  },
}

const accordionWrapper: SxProps = {
  '& > div:first-of-type': {
    borderRadius: 0,
  },
  '& > div:last-of-type': {
    borderRadius: 0,
  },
}

const errorIconWrapper: SxProps = {
  alignSelf: 'center',
  marginRight: '5px',
}

export const styles = {
  accordionContainer,
  errorIconWrapper,
  summaryContainer,
  accordionWrapper,
}
