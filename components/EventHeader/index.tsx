import { Box, Grid, Typography, Avatar, Hidden } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'

import { EventData } from 'src/api/event/types'

import { styles } from './styles'
import { getEventDateForSmallScreen } from './helpers'

export const EventHeader = ({ data }: { data: EventData }) => (
  <Box sx={styles.eventHeaderContainer}>
    <Avatar
      variant="square"
      src={data?.imageUrl}
      sx={styles.eventLogo}
      sizes="100%"
    >
      <ImageIcon />
    </Avatar>
    <Grid ml={'10px'}>
      <Typography sx={styles.title}>{data.name}</Typography>

      <Hidden smDown>
        <Typography>
          {data.hometown} | {data.localStartDate} - {data.localEndDate}
        </Typography>
      </Hidden>
      <Hidden smUp>
        <Typography sx={styles.eventDate}>
          {getEventDateForSmallScreen(data.localStartDate, data.localEndDate)}
        </Typography>
      </Hidden>
    </Grid>
  </Box>
)
