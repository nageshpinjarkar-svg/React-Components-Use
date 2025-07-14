import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material'
import { ReactNode, useRef } from 'react'
import { grey } from '@mui/material/colors'

import { styles } from './styles'
import { useCollapseAccordionOnScroll } from './hooks'

export type RegistrationAccordionProps = {
  children: ReactNode
  title?: string | JSX.Element
  subTitle?: string | JSX.Element

  isAccordionExpanded: boolean
  isAccordionDisabled: boolean
  renderCustomSummary?: () => JSX.Element
  handleAccordionSummaryClick?: () => void
  setIsAccordionExpanded: (boolean) => void
}

const RegistrationAccordion = ({
  children,
  title,
  subTitle,
  isAccordionDisabled,
  isAccordionExpanded,
  renderCustomSummary,
  handleAccordionSummaryClick,
  setIsAccordionExpanded,
}: RegistrationAccordionProps) => {
  const accordionDetailsRef = useRef<HTMLElement>()

  useCollapseAccordionOnScroll({
    accordionDetailsRef,
    isAccordionExpanded,
    setIsAccordionExpanded,
  })

  const renderSummary = () => {
    if (subTitle) {
      return (
        <Box>
          <Typography fontSize={'16px'}>{title}</Typography>
          <Typography fontSize={'14px'} color={grey[700]}>
            {subTitle}
          </Typography>
        </Box>
      )
    }

    return <Typography fontSize="24px">{title}</Typography>
  }
  return (
    <Box sx={styles.accordionWrapper}>
      <Accordion
        disableGutters
        expanded={isAccordionExpanded}
        sx={styles.accordionContainer}
        disabled={isAccordionDisabled}
        TransitionProps={{ timeout: 0 }}
      >
        <AccordionSummary
          onClick={() => {
            handleAccordionSummaryClick?.()
          }}
          expandIcon={<KeyboardArrowDownIcon />}
          sx={styles.summaryContainer}
        >
          {renderSummary()}
          {renderCustomSummary?.()}
        </AccordionSummary>
        <>
          <AccordionDetails
            sx={{ padding: '10px 0' }}
            ref={accordionDetailsRef}
          >
            {children}
          </AccordionDetails>
        </>
      </Accordion>
    </Box>
  )
}

export default RegistrationAccordion
