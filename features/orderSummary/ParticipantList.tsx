import { Box, Typography } from '@mui/material'

import RenderPriceOrLoader from 'src/components/shared/RenderPriceOrLoader'

import { EntryModel } from '../entries/types'

import { styles } from './styles'

interface RegistrationListProps {
  participantList: EntryModel[]
  isLoading: boolean
}

const RegistrationList = ({
  participantList,
  isLoading,
}: RegistrationListProps) => {
  return (
    <>
      {participantList.map((participant) => (
        <Box key={participant.details.email} sx={styles.orderItem}>
          <Typography>
            {`${participant.details.firstName} ${participant.details.lastName}`}
          </Typography>
          <Typography>
            <RenderPriceOrLoader
              value={`${participant.details.regChoice?.price ?? 0}`}
              isLoading={isLoading}
            />
          </Typography>
        </Box>
      ))}
    </>
  )
}

export default RegistrationList
