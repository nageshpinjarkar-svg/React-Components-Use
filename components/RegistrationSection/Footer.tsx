import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import {
  selectIsCookiesConsent,
  selectSectionStatus,
  updateSectionStatus,
} from 'src/features/policy/policySlice'
import { AppState } from 'src/app/store'
import { useGetCurrentUxMode } from 'src/features/shared/hooks'
import {
  FOOTER_COMPONENT,
  SECTION_ORDER_SUMMARY,
} from 'src/features/policy/constants'
import { selectSubtotal } from 'src/features/entries/entriesSlice'
import {
  formatNumberWithCurrency,
  scrollToTop,
} from 'src/features/shared/utils'
import { useEventData } from 'src/shared/hooks'

import { styles } from './styles'

export type FooterProps = {
  isNextDisabled?: boolean
  onClickNext?: () => void | null
  renderCustomFooter?: () => JSX.Element
}

const Footer = ({
  isNextDisabled,
  onClickNext,
  renderCustomFooter,
}: FooterProps) => {
  const { t } = useTranslation()
  const subtotal = useSelector(selectSubtotal)
  const dispatch = useDispatch()
  const { isScreensMode } = useGetCurrentUxMode()
  const { event } = useEventData()
  const formattedSubtotal = formatNumberWithCurrency(
    subtotal || 0,
    event?.currencyId
  )

  const isCookiesConsent = useSelector((state: AppState) =>
    selectIsCookiesConsent(state)
  )

  const { isVisible: isSectionVisible } = useSelector((state: AppState) =>
    selectSectionStatus(state, FOOTER_COMPONENT)
  )
  const { isVisible: isVisibleOrderSummarySection } = useSelector(
    (state: AppState) => selectSectionStatus(state, SECTION_ORDER_SUMMARY)
  )

  useEffect(() => {
    if (isVisibleOrderSummarySection) {
      dispatch(
        updateSectionStatus({
          name: FOOTER_COMPONENT,
          status: { isVisible: false },
        })
      )
    }

    return () => {
      dispatch(
        updateSectionStatus({
          name: FOOTER_COMPONENT,
          status: { isVisible: true },
        })
      )
    }
  }, [isVisibleOrderSummarySection])

  if (!isSectionVisible) {
    return null
  }

  return (
    <Box sx={styles.footer(!!isCookiesConsent)}>
      {renderCustomFooter ? (
        renderCustomFooter()
      ) : (
        <>
          <Typography fontSize={'24px'}>
            {t('subtotal') + ': ' + formattedSubtotal}
          </Typography>

          {isScreensMode && (
            <Button
              sx={styles.nextButton}
              variant="contained"
              onClick={() => {
                scrollToTop()
                onClickNext && onClickNext()
              }}
              disabled={isNextDisabled}
            >
              {t('next')}
            </Button>
          )}
        </>
      )}
    </Box>
  )
}

export default Footer
