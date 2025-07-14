import { SxProps } from '@mui/material'

const eventLogo: SxProps = {
  width: {
    xs: 42,
    sm: 70,
  },
  height: {
    xs: 42,
    sm: 70,
  },
}

const title: SxProps = {
  fontSize: '22px',
}

const eventDate: SxProps = {
  fontStyle: 'italic',
}

const eventHeaderContainer: SxProps = {
  display: 'flex',
  alignItems: 'center',
}

export const styles = {
  title,
  eventLogo,
  eventDate,
  eventHeaderContainer,
}
