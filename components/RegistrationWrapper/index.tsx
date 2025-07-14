import { Box, Paper } from '@mui/material'
import { ReactNode, forwardRef } from 'react'
import { useSelector } from 'react-redux'

import { FOOTER_COMPONENT } from 'src/features/policy/constants'
import { selectSectionStatus } from 'src/features/policy/policySlice'
import { AppState } from 'src/app/store'

import { AppTopBar } from '../shared'

import { styles } from './styles'

interface RegistrationWrapperProps {
  children: ReactNode
  isShowAllFieldsRequired?: boolean
}

const RegistrationWrapper = ({
  children,
  isShowAllFieldsRequired,
}: RegistrationWrapperProps) => {
  const { isVisible: isFooterVisible } = useSelector((state: AppState) =>
    selectSectionStatus(state, FOOTER_COMPONENT)
  )

  return (
    <Box sx={styles.paperWrapper}>
      <AppTopBar isShowAllFieldsRequired={isShowAllFieldsRequired} />
      <Paper sx={styles.paper(isFooterVisible)}>{children}</Paper>
    </Box>
  )
}

export default forwardRef(RegistrationWrapper)
